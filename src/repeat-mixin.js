/**
 * A mixin to stamp out a template from an array property (items)
 *
 * (pretty experimental and inefficient currently I think!)
 */

// cache for template elememts
const templateCache = {};

const CompostRepeatMixin = parent => (
  class extends parent {
    static get properties() {
      return {
        // the property from which the elements will be bound to
        items: {
          type: Array,
          value: [],
          observer: 'observeItems',
        },
      };
    }

    render(staticTemplateString, staticPostTemplateString = '') {
      // the elements will be added to the light DOM (slot)
      return `
        ${staticTemplateString}
        <slot></slot>
        ${staticPostTemplateString}
      `;
    }

    /**
     * The template string to use for the value at items[index] (value)
     */
    getTemplateString(value, index) {
      return '<div></div>';
    }

    /**
     * Create a template element from a string
     */
    createTemplate(templateString) {
      const template = document.createElement('template');
      template.innerHTML = templateString;

      return template;
    }

    /**
     * a unique key for each element
     */
    getKey(value, index) {
      return index;
    }

    /**
     * how to initialise the element each time it's value changes
     */
    updateItem(el, value, index) {}


    /**
     * stamp out a new element
     */
    _createItem(value, index) {
      const templateString = this.getTemplateString(value, index);
      let template;

      if (templateCache[templateString]) {
        template = templateCache[templateString];
      } else {
        template = this.createTemplate(templateString);
        templateCache[templateString] = template;
      }

      const instance = template.content.cloneNode(true);

      // get first non-text node of instance

      // const el = instance.children[0];
      // above doesn't work on IE11
      const el = [...instance.childNodes]
        .filter(node => node.nodeType === Node.ELEMENT_NODE)[0];

      // set key
      el.key = this.getKey(value, index);

      return el;
    }

    /**
     * Update elements when items changes
     */
    observeItems(oldValues, values) {
      let existingElements = this.$('slot').assignedNodes();

      // add keys as sub properties on all items
      const keyedValues = values.map((value, index) => (
        Object.assign({}, value, {
          key: this.getKey(value, index),
        })
      ));

      const newKeys = keyedValues.map(value => value.key);
      const existingKeys = existingElements.map(el => el.key);

      // remove items that have no matching key in items
      existingKeys.forEach((existingKey) => {
        if (newKeys.indexOf(existingKey) === -1) {
          const el = existingElements.find(existingEl => existingEl.key === existingKey);
          this.removeChild(el);
        }
      });

      // get existing elements after any removals
      existingElements = this.$('slot').assignedNodes();

      // get or create elements for each value in items
      const orderedElements = [];

      newKeys.forEach((newKey) => {
        const index = keyedValues.findIndex(value => value.key === newKey);

        let el;
        // if no matching key, create new element else get existing
        if (existingKeys.indexOf(newKey) === -1) {
          el = this._createItem(values[index], index);
        } else {
          el = existingElements.find(existingEl => existingEl.key === newKey);
        }

        orderedElements.push(el);
      });

      // for each item, update element if needed
      orderedElements.forEach((newChild, index) => {
        const existingChild = existingElements[index];

        if (existingChild) {
          // if there's a new value at this index
          if (newChild.key !== existingChild.key) {
            // insert new element at this index, keeping old element
            this.insertBefore(newChild, existingChild);
          }
        } else {
          // add new element to end of current list

          // Browsers using the webcomponents polyfill do no upgrade custom
          // elements when using appendChild(?) on this. Appending to body,
          // and then attaching to this seems to work.
          document.querySelector('body').appendChild(newChild);
          this.appendChild(newChild);
        }

        // update the item
        this.updateItem(newChild, values[index], index);

        existingElements = this.$('slot').assignedNodes();
      });
    }
  }
);

export default CompostRepeatMixin;
