import * as Helpers from './properties-helpers';

export default function () {
  describe('when creating element', function () {
    beforeEach(function () {
      spyOn(this.customEl.prototype, 'observeUsername');
      spyOn(this.customEl.prototype, 'observeSigninAttempts');
      spyOn(this.customEl.prototype, 'observeValid');
      spyOn(this.customEl.prototype, 'observeItems');
      spyOn(this.customEl.prototype, 'observeInfo');
    });

    describe('using createElement', function () {
      beforeEach(function () {
        this.testEl = document.createElement(this.elName);
        this.testEl.id = 'test';
      });

      afterEach(function () {
        this.appEl.innerHTML = '';
      });

      it('can set default properties', function (done) {
        Helpers.canSetDefaultProperties(this, done);
      });

      it('can set string property before append', function (done) {
        this.propName = 'username';
        this.value = 'Chris';
        this.previousValue = undefined;
        Helpers.canSetStringProperty(this, done);
      });

      it('can set number property before append', function (done) {
        this.propName = 'signinAttempts';
        this.value = 10;
        this.previousValue = undefined;
        Helpers.canSetNumberProperty(this, done);
      });

      it('can set boolean property before append', function (done) {
        this.propName = 'valid';
        this.value = false;
        this.previousValue = undefined;
        Helpers.canSetBooleanProperty(this, done);
      });

      it('can set array property before append', function (done) {
        this.propName = 'items';
        this.value = ['a', 'b', 'c'];
        this.previousValue = undefined;
        Helpers.canSetArrayProperty(this, done);
      });

      it('can set object property before append', function (done) {
        this.propName = 'info';
        this.value = {
          x: 'a',
          y: 'b',
          z: 'c',
        };
        this.previousValue = undefined;
        Helpers.canSetObjectProperty(this, done);
      });
    });

    describe('using new Element()', function () {
      beforeEach(function () {
        this.testEl = new this.customEl();
        this.testEl.id = 'test';
      });

      afterEach(function () {
        this.appEl.innerHTML = '';
      });

      it('can set default properties', function (done) {
        Helpers.canSetDefaultProperties(this, done);
      });

      it('can set string property before append', function (done) {
        this.propName = 'username';
        this.value = 'Chris';
        this.previousValue = undefined;
        Helpers.canSetStringProperty(this, done);
      });

      it('can set number property before append', function (done) {
        this.propName = 'signinAttempts';
        this.value = 10;
        this.previousValue = undefined;
        Helpers.canSetNumberProperty(this, done);
      });

      it('can set boolean property before append', function (done) {
        this.propName = 'valid';
        this.value = false;
        this.previousValue = undefined;
        Helpers.canSetBooleanProperty(this, done);
      });

      it('can set array property before append', function (done) {
        this.propName = 'items';
        this.value = ['a', 'b', 'c'];
        this.previousValue = undefined;
        Helpers.canSetArrayProperty(this, done);
      });

      it('can set object property before append', function (done) {
        this.propName = 'info';
        this.value = {
          x: 'a',
          y: 'b',
          z: 'c',
        };
        this.previousValue = undefined;
        Helpers.canSetObjectProperty(this, done);
      });
    });

    describe('using DOM', function () {
      afterEach(function () {
        this.appEl.innerHTML = '';
      });

      it('can set default properties', function (done) {
        const str = `<${this.elName} id="test"></${this.elName}>`;
        this.appEl.innerHTML = str;
        this.testEl = document.getElementById('test');
        Helpers.canSetDefaultProperties(this, done, false);
      });

      it('can initialise string property from attribute', function (done) {
        const value = 'Dave';
        const propName = 'username';
        const attrName = this.customEl.propertyNameToAttributeName(propName);
        const observerName = this.customEl.properties[propName].observer;

        const str = `<${this.elName} ${attrName}="${value}" id="test"></${this.elName}>`;
        this.appEl.innerHTML = str;

        const el = document.getElementById('test');

        Promise.resolve().then(() => {
          expect(el[propName]).toBe(value);
          expect(el.getAttribute(attrName)).toBe(value);
          expect(el[observerName].calls.count()).toBe(1);
          expect(el[observerName]).toHaveBeenCalledWith(undefined, value);

          done();
        });
      });

      it('can initialise number property from attribute', function (done) {
        const value = 100;
        const propName = 'signinAttempts';
        const attrName = this.customEl.propertyNameToAttributeName(propName);
        const observerName = this.customEl.properties[propName].observer;

        const str = `<${this.elName} ${attrName}="${value}" id="test"></${this.elName}>`;
        this.appEl.innerHTML = str;

        const el = document.getElementById('test');

        Promise.resolve().then(() => {
          expect(el[propName]).toBe(value);
          expect(el.getAttribute(attrName)).toBe(`${value}`);
          expect(el[observerName].calls.count()).toBe(1);
          expect(el[observerName]).toHaveBeenCalledWith(undefined, value);

          done();
        });
      });

      it('can initialise boolean property from attribute', function (done) {
        const value = true;
        const propName = 'valid';
        const attrName = this.customEl.propertyNameToAttributeName(propName);
        const observerName = this.customEl.properties[propName].observer;

        const str = `<${this.elName} ${value ? attrName : ''} id="test"></${this.elName}>`;
        this.appEl.innerHTML = str;

        const el = document.getElementById('test');

        Promise.resolve().then(() => {
          expect(el[propName]).toBe(value);
          expect(el.hasAttribute(attrName)).toBe(value);
          expect(el[observerName].calls.count()).toBe(1);
          expect(el[observerName]).toHaveBeenCalledWith(undefined, value);

          done();
        });
      });

      it('can initialise array property from attribute', function (done) {
        const value = ['d', 'e', 'f'];
        const propName = 'items';
        const attrName = this.customEl.propertyNameToAttributeName(propName);
        const observerName = this.customEl.properties[propName].observer;

        const str = `<${this.elName} ${attrName}='${JSON.stringify(value)}' id="test"></${this.elName}>`;
        this.appEl.innerHTML = str;

        const el = document.getElementById('test');

        Promise.resolve().then(() => {
          expect(el[propName]).toEqual(value);
          expect(el.getAttribute(attrName)).toBe(JSON.stringify(value));
          expect(el[observerName].calls.count()).toBe(1);
          expect(el[observerName]).toHaveBeenCalledWith(undefined, value);

          done();
        });
      });

      it('can initialise object property from attribute', function (done) {
        const value = { a: [], b: true };
        const propName = 'info';
        const attrName = this.customEl.propertyNameToAttributeName(propName);
        const observerName = this.customEl.properties[propName].observer;

        const str = `<${this.elName} ${attrName}='${JSON.stringify(value)}' id="test"></${this.elName}>`;
        this.appEl.innerHTML = str;

        const el = document.getElementById('test');

        Promise.resolve().then(() => {
          expect(el[propName]).toEqual(value);
          expect(el.getAttribute(attrName)).toBe(JSON.stringify(value));
          expect(el[observerName].calls.count()).toBe(1);
          expect(el[observerName]).toHaveBeenCalledWith(undefined, value);

          done();
        });
      })
    });
  });
};
