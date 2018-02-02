
const CompostRepeatMixin = (parent) => {
  return class extends parent {
    static get properties() {
      return {
        items: {
          type: Array,
          value: [],
          observer: 'observeItems',
        },
      };
    }

    render(staticTemplateString, repeatTemplateString) {
      return `
        ${staticTemplateString}
        <template>${repeatTemplateString}</template>
        <slot></slot>
      `;
    }

    getKey(value, index) {
      return index;
    }

    updateItem(el, value, index) {}

    _createItem(value, index) {
      const template = this.$('template');

      const instance = template.content.cloneNode(true);

      // const el = instance.children[0];
      // above doesn't work on IE11
      const el = [...instance.childNodes]
        .filter(node => node.nodeType === Node.ELEMENT_NODE)[0];
      el.key = this.getKey(value, index);
      return el;
    }

    observeItems(oldValues, values) {
      let existingElements = this.$('slot').assignedNodes();

      const keyedValues = values.map((value, index) => {
        return Object.assign({}, value, {
          key: this.getKey(value, index),
        });
      });

      const newKeys = keyedValues.map(value => value.key);
      const existingKeys = existingElements.map(el => el.key);

      existingKeys.forEach((existingKey) => {
        if (newKeys.indexOf(existingKey) === -1) {
          const el = existingElements.find(el => el.key === existingKey);
          this.removeChild(el);
        }
      });

      // get existing elements after any removals
      existingElements = this.$('slot').assignedNodes();

      const orderedElements = [];

      newKeys.forEach((newKey) => {
        const index = keyedValues.findIndex(value => value.key === newKey);

        let el;
        if (existingKeys.indexOf(newKey) === -1) {
          el = this._createItem(values[index], index);
        } else {
          el = existingElements.find(el => el.key === newKey);
        }

        orderedElements.push(el);
      });

      orderedElements.forEach((newChild, index) => {
        const existingChild = existingElements[index];

        if (existingChild) {
          if (newChild.key !== existingChild.key) {
            this.insertBefore(newChild, existingChild);

            if (!orderedElements.includes(existingChild)) {
              // this.removeChild(existingChild);
            }
          }
        } else {
          // Browsers using the webcomponents polyfill, do no upgrade custom
          // elements when using appendChild(?) on this. Appending to body,
          // and then attaching to this seems to work.
          document.querySelector('body').appendChild(newChild);
          this.appendChild(newChild);
        }

        this.updateItem(newChild, values[index], index);

        existingElements = this.$('slot').assignedNodes();
      });
    }
  }
};

export default CompostRepeatMixin;
