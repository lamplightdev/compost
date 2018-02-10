const setStack = [];

const CompostPropertiesMixin = (parent) => {
  return class extends parent {
    static get properties() {
      return {};
    }

    static get observedAttributes() {
      return Object.keys(this.properties)
        .map(propName => this.propertyNameToAttributeName(propName));
    }

    constructor() {
      super();

      this._connected = false;
      this._props = {};
      this._propsToAttrs = {};
      this._attrsToProps = {};
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

      if (!this._connected) {
        Object.keys(this.constructor.properties).forEach((propName) => {
          const attributeName = this._propsToAttrs[propName];

          const initialValue = this.hasOwnProperty(propName)
            ? this[propName] : this.constructor.properties[propName].value;

          delete this[propName];

          Object.defineProperty(this, propName, {
            get: () => { return this._props[propName]; },
            set: (value) => { this.set(propName, value); },
          });

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
        switch (this.constructor.properties[propName].type) {
          case Number:
            this[propName] = Number(newValue);
            break;
          case Boolean:
            this[propName] = newValue === null ? false : true;
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

    set(propName, value) {
      let oldValue = this._props[propName];

      switch (this.constructor.properties[propName].type) {
        case Number:
          this._props[propName] = value === null ? null : Number(value);
          break;
        default:
          this._props[propName] = value;
          break;
      }

      if (oldValue !== this[propName]) {
        if (this.constructor.properties[propName].reflectToAttribute) {
          const attributeName = this._propsToAttrs[propName];

          if (this[propName] === null) {
            this.removeAttribute(attributeName);
          } else {

            switch (this.constructor.properties[propName].type) {
              case Boolean:
                if (this[propName]) {
                  this._ignoreNextAttributeChange[attributeName] = true;
                  this.setAttribute(attributeName, '');
                } else {
                  this.removeAttribute(attributeName)
                }
                break;
              case Array: case Object:
                this._ignoreNextAttributeChange[attributeName] = true;
                this.setAttribute(attributeName, JSON.stringify(this[propName]));
                break;
              default:
                this._ignoreNextAttributeChange[attributeName] = true;
                this.setAttribute(attributeName, this[propName]);
                break;
            }
          }
        }

        if (this.constructor.properties[propName].observer) {
          const existingItemIndex = setStack.findIndex((item) => {
            return item.component === this && item.propName === propName;
          });

          if (existingItemIndex > -1) {
            const existingItem = setStack[existingItemIndex];
            setStack.splice(existingItemIndex, 1);
            oldValue = existingItem.oldValue;
          }

          setStack.unshift({
            component: this,
            propName,
            observer: this.constructor.properties[propName].observer,
            oldValue,
            newValue: this[propName],
          });

          if (loopPaused) {
            Promise.resolve().then(() => {
              if (loopPaused) {
                loopPaused = false;
                // requestIdleCallback(loopSetStack);
                runLoop();
              }
            });
          }
        }
      }
    }
  }
};

let loopPaused = true;

const runLoop = (deadline) => {
  loopPaused = false;

  while (setStack.length > 0) {
    const item = setStack.pop();

    if (item.oldValue !== item.newValue) {
      item.component[item.observer](item.oldValue, item.newValue);
    }
  }

  if (setStack.length > 0) {
    runLoop();
  } else {
    loopPaused = true;
  }
}

const loopSetStack = (deadline) => {
  loopPaused = false;

  while (deadline.timeRemaining() > 0 && setStack.length > 0) {
    const item = setStack.pop();

    if (item.oldValue !== item.newValue) {
      item.component[item.observer](item.oldValue, item.newValue);
    }
  }

  if (setStack.length > 0) {
    requestIdleCallback(loopSetStack);
  } else {
    loopPaused = true;
  }
}

export default CompostPropertiesMixin;
