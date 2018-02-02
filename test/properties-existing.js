import * as Helpers from './properties-helpers';

export default function() {
  describe('when element exists in DOM', function () {
    beforeEach(function () {
      const str = `<${this.elName} id="test"></${this.elName}>`;
      this.appEl.innerHTML = str;

      this.testEl = document.getElementById('test');

      spyOn(this.customEl.prototype, 'observeUsername');
      spyOn(this.customEl.prototype, 'observeSigninAttempts');
      spyOn(this.customEl.prototype, 'observeValid');
      spyOn(this.customEl.prototype, 'observeItems');
      spyOn(this.customEl.prototype, 'observeInfo');
    });

    afterEach(function () {
      this.appEl.innerHTML = '';
    });

    it('can set string property', function () {
      this.propName = 'username';
      this.value = 'Chris';
      this.previousValue = this.testEl.constructor.properties.username.value;
      Helpers.canSetStringProperty(this, false);
    });

    it('no changes or observer called for string that stays the same', function () {
      this.propName = 'username';
      this.value = this.testEl.constructor.properties.username.value;
      this.previousValue = this.testEl.constructor.properties.username.value;

      this.testEl[this.propName] = this.value;

      const el = document.getElementById('test');

      const attrName = el.constructor.propertyNameToAttributeName(this.propName);
      const observerName = el.constructor.properties[this.propName].observer;

      expect(el[this.propName]).toBe(this.value);
      expect(el.getAttribute(attrName)).toBe(this.value);
      expect(el[observerName].calls.count()).toBe(0);
    });

    it('can set number property', function () {
      this.propName = 'signinAttempts';
      this.value = 10;
      this.previousValue = this.testEl.constructor.properties.signinAttempts.value;
      Helpers.canSetNumberProperty(this, false);
    });

    it('can set boolean property', function () {
      this.propName = 'valid';
      this.value = !this.testEl.constructor.properties.valid.value;
      this.previousValue = this.testEl.constructor.properties.valid.value;
      Helpers.canSetBooleanProperty(this, false);
    });

    it('can set array property', function () {
      this.propName = 'items';
      this.value = ['a', 'b', 'c'];
      this.previousValue = this.testEl.constructor.properties.items.value;
      Helpers.canSetArrayProperty(this, false);
    });

    it('can set object property', function () {
      this.propName = 'info';
      this.value = {
        x: 'a',
        y: 'b',
        z: 'c',
      };
      this.previousValue = this.testEl.constructor.properties.info.value;
      Helpers.canSetObjectProperty(this, false);
    });

    it('can set string property from attribute', function () {
      this.propName = 'username';
      this.value = 'Chris';
      this.previousValue = this.testEl.constructor.properties.username.value;
      Helpers.canSetStringPropertyFromAttribute(this);
    });

    it('can set number property from attribute', function () {
      this.propName = 'signinAttempts';
      this.value = 10;
      this.previousValue = this.testEl.constructor.properties.signinAttempts.value;
      Helpers.canSetNumberPropertyFromAttribute(this);
    });

    it('can set boolean property from attribute', function () {
      this.propName = 'valid';
      this.value = !this.testEl.constructor.properties.valid.value;
      this.previousValue = this.testEl.constructor.properties.valid.value;
      Helpers.canSetBooleanPropertyFromAttribute(this);
    });

    it('can set array property from attribute', function () {
      this.propName = 'items';
      this.value = ['a', 'b', 'c'];
      this.previousValue = this.testEl.constructor.properties.items.value;
      Helpers.canSetArrayPropertyFromAttribute(this);
    });

    it('can set object property from attribute', function () {
      this.propName = 'info';
      this.value = {
        x: 'a',
        y: 'b',
        z: 'c',
      };
      this.previousValue = this.testEl.constructor.properties.info.value;
      Helpers.canSetObjectPropertyFromAttribute(this);
    });
  });
};
