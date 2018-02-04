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
      const oldValue = this._props[propName];

      switch (this.constructor.properties[propName].type) {
        case Number:
          this._props[propName] = Number(value);
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
          // requestAnimationFrame(() => {
          this[this.constructor.properties[propName].observer](oldValue, this[propName]);
          // });
        }
      }
    }
  }
};

export default CompostPropertiesMixin;
