
/* eslint prefer-arrow-callback: "off" */
/* eslint func-names: "off" */

import CompostPropertiesMixin from '../src/properties-mixin';

import creatingTests from './properties-creating';
import existingTests from './properties-existing';

const propertyGroups = [{
  username: {
    type: String,
    value: null,
    observer: 'observeUsername',
    reflectToAttribute: true,
  },

  signinAttempts: {
    type: Number,
    value: null,
    reflectToAttribute: true,
    observer: 'observeSigninAttempts',
  },

  valid: {
    type: Boolean,
    value: false, // null here doesn't really make sense?
    observer: 'observeValid',
    reflectToAttribute: true,
  },

  items: {
    type: Array,
    value: null,
    observer: 'observeItems',
    reflectToAttribute: true,
  },

  info: {
    type: Array,
    value: null,
    observer: 'observeInfo',
    reflectToAttribute: true,
  },
}, {
  username: {
    type: String,
    value: 'Alice',
    observer: 'observeUsername',
    reflectToAttribute: true,
  },

  signinAttempts: {
    type: Number,
    value: 5,
    reflectToAttribute: true,
    observer: 'observeSigninAttempts',
  },

  valid: {
    type: Boolean,
    value: false, // null here doesn't really make sense?
    observer: 'observeValid',
    reflectToAttribute: true,
  },

  items: {
    type: Array,
    value: [1, 2, 3],
    observer: 'observeItems',
    reflectToAttribute: true,
  },

  info: {
    type: Array,
    value: {
      a: 1,
      b: 2,
      c: 3,
    },
    observer: 'observeInfo',
    reflectToAttribute: true,
  },
}];

propertyGroups.forEach((propertyGroup, groupIndex) => {
  const elName = `compost-element${groupIndex}`;
  const CustomEl = class CompostElement extends CompostPropertiesMixin(HTMLElement) {
    static get properties() {
      return propertyGroup;
    }

    observeUsername() { }
    observeSigninAttempts() { }
    observeValid() { }
    observeItems() { }
    observeInfo() { }
  };

  customElements.define(elName, CustomEl);

  describe(`with propertyGroup ${groupIndex}`, function () {
    beforeEach(function () {
      this.elName = elName;
      this.CustomEl = CustomEl;

      this.appEl = document.createElement('div');
      this.appEl.id = 'app';
      document.body.appendChild(this.appEl);
    });

    afterEach(function () {
      document.body.removeChild(this.appEl);
    });

    creatingTests();
    existingTests();
  });
});
