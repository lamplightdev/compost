/* eslint prefer-arrow-callback: "off" */
/* eslint func-names: "off" */

import * as Helpers from './properties-helpers';

export default function () {
  describe('when element exists in DOM', function () {
    beforeEach(function (done) {
      const str = `<${this.elName} id="test"></${this.elName}>`;
      this.appEl.innerHTML = str;

      this.testEl = document.getElementById('test');

      Promise.resolve().then(() => {
        spyOn(this.CustomEl.prototype, 'observeUsername');
        spyOn(this.CustomEl.prototype, 'observeSigninAttempts');
        spyOn(this.CustomEl.prototype, 'observeValid');
        spyOn(this.CustomEl.prototype, 'observeItems');
        spyOn(this.CustomEl.prototype, 'observeInfo');

        done();
      });
    });

    afterEach(function () {
      this.appEl.innerHTML = '';
    });

    it('can set string property', function (done) {
      this.propName = 'username';
      this.value = 'Chris';
      this.previousValue = this.testEl.constructor.properties.username.value;
      Helpers.canSetStringProperty(this, done, false);
    });

    it('no changes or observer called for string that stays the same', function (done) {
      this.propName = 'username';
      this.value = this.testEl.constructor.properties.username.value;
      this.previousValue = this.testEl.constructor.properties.username.value;

      this.testEl[this.propName] = this.value;

      const el = document.getElementById('test');

      const attrName = el.constructor.propertyNameToAttributeName(this.propName);
      const observerName = el.constructor.properties[this.propName].observer;

      Promise.resolve().then(() => {
        expect(el[this.propName]).toBe(this.value);
        expect(el.getAttribute(attrName)).toBe(this.value);
        expect(el[observerName].calls.count()).toBe(0);

        done();
      });
    });

    it('can set number property', function (done) {
      this.propName = 'signinAttempts';
      this.value = 10;
      this.previousValue = this.testEl.constructor.properties.signinAttempts.value;
      Helpers.canSetNumberProperty(this, done, false);
    });

    it('can set boolean property', function (done) {
      this.propName = 'valid';
      this.value = !this.testEl.constructor.properties.valid.value;
      this.previousValue = this.testEl.constructor.properties.valid.value;
      Helpers.canSetBooleanProperty(this, done, false);
    });

    it('can set array property', function (done) {
      this.propName = 'items';
      this.value = ['a', 'b', 'c'];
      this.previousValue = this.testEl.constructor.properties.items.value;
      Helpers.canSetArrayProperty(this, done, false);
    });

    it('can set object property', function (done) {
      this.propName = 'info';
      this.value = {
        x: 'a',
        y: 'b',
        z: 'c',
      };
      this.previousValue = this.testEl.constructor.properties.info.value;
      Helpers.canSetObjectProperty(this, done, false);
    });

    it('can set string property from attribute', function (done) {
      this.propName = 'username';
      this.value = 'Chris';
      this.previousValue = this.testEl.constructor.properties.username.value;
      Helpers.canSetStringPropertyFromAttribute(this, done);
    });

    it('can set number property from attribute', function (done) {
      this.propName = 'signinAttempts';
      this.value = 10;
      this.previousValue = this.testEl.constructor.properties.signinAttempts.value;
      Helpers.canSetNumberPropertyFromAttribute(this, done);
    });

    it('can set boolean property from attribute', function (done) {
      this.propName = 'valid';
      this.value = !this.testEl.constructor.properties.valid.value;
      this.previousValue = this.testEl.constructor.properties.valid.value;
      Helpers.canSetBooleanPropertyFromAttribute(this, done);
    });

    it('can set array property from attribute', function (done) {
      this.propName = 'items';
      this.value = ['a', 'b', 'c'];
      this.previousValue = this.testEl.constructor.properties.items.value;
      Helpers.canSetArrayPropertyFromAttribute(this, done);
    });

    it('can set object property from attribute', function (done) {
      this.propName = 'info';
      this.value = {
        x: 'a',
        y: 'b',
        z: 'c',
      };
      this.previousValue = this.testEl.constructor.properties.info.value;
      Helpers.canSetObjectPropertyFromAttribute(this, done);
    });
  });
}
