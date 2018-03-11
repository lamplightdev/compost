/**
 * Polymer inspired Custom Element property mixin
 * to allow definition of property types and observers
 */


/*
 * Stack to hold the currently waiting observers.
 * Observers get processed FIFO, and the current stack
 * is processed in it's entirety at the end of each task
 * as a microtask (deferred using a promise)
 *
 * This means the order in which properties are set in a task
 * doesn't matter as each observer will have access to the latest
 * values of each property
 */
const setStack = [];

// whether or not the stack is currently being processed
let loopPaused = true;

// the loop to empty the setStack
const runLoop = () => {
  loopPaused = false;

  while (setStack.length > 0) {
    const item = setStack.pop();

    // only call observer if the value has changed
    // (the value may have been set multiple times)
    if (item.oldValue !== item.newValue) {
      item.component[item.observer](item.oldValue, item.newValue);

      const multiObservers = item.component.constructor.multiObservers || {};
      Object.keys(multiObservers).forEach((observerName) => {
        const props = multiObservers[observerName];
        if (!props.some(prop => typeof item.component[prop] === 'undefined')) {
          item.component[observerName](...props.map(prop => item.component[prop]));
        }
      });
    }
  }

  loopPaused = true;
};

const CompostPropertiesMixin = parent => (
  class extends parent {
    /**
     * this holds the properties of the element
     *
     * returns an object keyed by the property name
     *
     * each property is an object containing:
     *
     * type: the Javascript type of the property
     *  one of: String, Number, Boolean, Array, Object
     *
     * value (optional): the default value the property should take
     *  otherwise undefined
     *
     * observer (optional): a method on the element that should be called
     *  when the property changes - takes oldValue, newValue as args
     *
     * reflectToAttribute (optional): if true when the property changes, it's
     *  value will set as an attribute on the element with the same name.
     *  camelCased property names are converted to kebab-case
     *
     *
     * Note: on initialisation of the element, any attribute with the same
     * name as a property (kebab-case -> camelCase) will be set as the initial
     * property value, overriding the default value from above
     */
    static get properties() {
      return {};
    }

    static get observedAttributes() {
      // Observe attributes for all defined properties
      return Object.keys(this.properties)
        .map(propName => this.propertyNameToAttributeName(propName));
    }

    constructor() {
      super();

      /**
       * if the element has already been connected to the DOM, so we don't
       * run initialisation more than once
       */
      this._connected = false;

      /**
       * an object to hold the current property values
       */
      this._props = {};

      /**
       * a map of property names to attribute names
       */
      this._propsToAttrs = {};

      /**
       * a map of attribute names to property names
       */
      this._attrsToProps = {};

      /**
       * which attributes we should ignore on next attributeChangedCallback
       * to prevent infinite loops
       */
      this._ignoreNextAttributeChange = {};

      Object.keys(this.constructor.properties).forEach((propName) => {
        const attributeName = this.constructor.propertyNameToAttributeName(propName);

        this._propsToAttrs[propName] = attributeName;
        this._attrsToProps[attributeName] = propName;
      });
    }

    static propertyNameToAttributeName(propName) {
      return propName.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }

      // don't run if we've already defined the properties
      if (!this._connected) {
        Object.keys(this.constructor.properties).forEach((propName) => {
          const attributeName = this._propsToAttrs[propName];

          // initial property value is either that already set on the element
          // or the default value it's been given
          const initialValue = Object.prototype.hasOwnProperty.call(this, propName)
            ? this[propName] : this.constructor.properties[propName].value;

          // remove the current property
          delete this[propName];

          // define setters and getters for the properties
          Object.defineProperty(this, propName, {
            get: () => this._props[propName],
            set: (value) => { this.set(propName, value); },
          });

          // set the property value either as the initial value, or if there is
          // an attribute set, to the attribute value
          if (!this.hasAttribute(attributeName)) {
            this[propName] = initialValue;
          } else {
            this.attributeChangedCallback(
              attributeName,
              undefined,
              this.getAttribute(attributeName),
            );
          }
        });

        this._connected = true;
      }
    }

    attributeChangedCallback(name, oldValue, newValue) {
      const propName = this._attrsToProps[name];

      if (!this._ignoreNextAttributeChange[name]) {
        // format property according to type
        switch (this.constructor.properties[propName].type) {
          case Number:
            this[propName] = Number(newValue);
            break;
          case Boolean:
            this[propName] = newValue !== null;
            break;
          case Array: case Object:
            this[propName] = JSON.parse(newValue);
            break;
          default:
            this[propName] = newValue;
            break;
        }
      }

      this._ignoreNextAttributeChange[name] = false;
    }

    /**
     * The setter for the properties
     */
    set(propName, value) {
      // keep ahold of the current value;
      let oldValue = this._props[propName];

      switch (this.constructor.properties[propName].type) {
        case Number:
          // Number(null) === 0, but we want to allow nulls
          this._props[propName] = value === null ? null : Number(value);
          break;
        default:
          this._props[propName] = value;
          break;
      }

      // if property has changed
      if (oldValue !== this[propName]) {
        if (this.constructor.properties[propName].reflectToAttribute) {
          const attributeName = this._propsToAttrs[propName];

          // Remove the attribute if new value is null
          if (this[propName] === null) {
            this.removeAttribute(attributeName);
          } else {
            switch (this.constructor.properties[propName].type) {
              case Boolean:
                if (this[propName]) {
                  // ignore the next attribute changed callback otherwise
                  // there'll be an infinite loop
                  this._ignoreNextAttributeChange[attributeName] = true;

                  // a truthy value sets the attribute to an empty string
                  this.setAttribute(attributeName, '');
                } else {
                  // a falsey value removes the attribute
                  this.removeAttribute(attributeName);
                }
                break;
              case Array: case Object:
                // ignore the next attribute changed callback otherwise
                // there'll be an infinite loop
                this._ignoreNextAttributeChange[attributeName] = true;
                this.setAttribute(attributeName, JSON.stringify(this[propName]));
                break;
              default:
                // ignore the next attribute changed callback otherwise
                // there'll be an infinite loop
                this._ignoreNextAttributeChange[attributeName] = true;
                this.setAttribute(attributeName, this[propName]);
                break;
            }
          }
        }

        // if this property is observed
        if (this.constructor.properties[propName].observer) {

          // check to see if this property has been changed already in this task
          const existingItemIndex = setStack.findIndex(item => (
            item.component === this && item.propName === propName
          ));

          // if it has already been changed
          if (existingItemIndex > -1) {
            // find where in stack the previous changed is queued
            const existingItem = setStack[existingItemIndex];
            // remove it
            setStack.splice(existingItemIndex, 1);
            // keep the oldValue as the original property value
            oldValue = existingItem.oldValue;
          }

          // put the observer on the stack to call later
          setStack.unshift({
            component: this,
            propName,
            observer: this.constructor.properties[propName].observer,
            oldValue,
            newValue: this[propName],
          });

          if (loopPaused) {
            // wait until microtasks are run
            Promise.resolve().then(() => {
              if (loopPaused) {
                loopPaused = false;
                // process stack
                runLoop();
              }
            });
          }
        }
      }
    }
  }
);

export default CompostPropertiesMixin;
