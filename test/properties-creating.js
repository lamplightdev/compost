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

      it('can set default properties', function () {
        Helpers.canSetDefaultProperties(this);
      });

      it('can set string property before append', function () {
        this.propName = 'username';
        this.value = 'Chris';
        this.previousValue = undefined;
        Helpers.canSetStringProperty(this);
      });

      it('can set number property before append', function () {
        this.propName = 'signinAttempts';
        this.value = 10;
        this.previousValue = undefined;
        Helpers.canSetNumberProperty(this);
      });

      it('can set boolean property before append', function () {
        this.propName = 'valid';
        this.value = false;
        this.previousValue = undefined;
        Helpers.canSetBooleanProperty(this);
      });

      it('can set array property before append', function () {
        this.propName = 'items';
        this.value = ['a', 'b', 'c'];
        this.previousValue = undefined;
        Helpers.canSetArrayProperty(this);
      });

      it('can set object property before append', function () {
        this.propName = 'info';
        this.value = {
          x: 'a',
          y: 'b',
          z: 'c',
        };
        this.previousValue = undefined;
        Helpers.canSetObjectProperty(this);
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

      it('can set default properties', function () {
        Helpers.canSetDefaultProperties(this);
      });

      it('can set string property before append', function () {
        this.propName = 'username';
        this.value = 'Chris';
        this.previousValue = undefined;
        Helpers.canSetStringProperty(this);
      });

      it('can set number property before append', function () {
        this.propName = 'signinAttempts';
        this.value = 10;
        this.previousValue = undefined;
        Helpers.canSetNumberProperty(this);
      });

      it('can set boolean property before append', function () {
        this.propName = 'valid';
        this.value = false;
        this.previousValue = undefined;
        Helpers.canSetBooleanProperty(this);
      });

      it('can set array property before append', function () {
        this.propName = 'items';
        this.value = ['a', 'b', 'c'];
        this.previousValue = undefined;
        Helpers.canSetArrayProperty(this);
      });

      it('can set object property before append', function () {
        this.propName = 'info';
        this.value = {
          x: 'a',
          y: 'b',
          z: 'c',
        };
        this.previousValue = undefined;
        Helpers.canSetObjectProperty(this);
      });
    });

    describe('using DOM', function () {
      afterEach(function () {
        this.appEl.innerHTML = '';
      });

      it('can set default properties', function () {
        const str = `<${this.elName} id="test"></${this.elName}>`;
        this.appEl.innerHTML = str;
        this.testEl = document.getElementById('test');
        Helpers.canSetDefaultProperties(this, false);
      });

      it('can initialise string property from attribute', function () {
        const value = 'Dave';
        const propName = 'username';
        const attrName = this.customEl.propertyNameToAttributeName(propName);
        const observerName = this.customEl.properties[propName].observer;

        const str = `<${this.elName} ${attrName}="${value}" id="test"></${this.elName}>`;
        this.appEl.innerHTML = str;

        const el = document.getElementById('test');

        expect(el[propName]).toBe(value);
        expect(el.getAttribute(attrName)).toBe(value);
        expect(el[observerName].calls.count()).toBe(1);
        expect(el[observerName]).toHaveBeenCalledWith(undefined, value);
      });

      it('can initialise number property from attribute', function () {
        const value = 100;
        const propName = 'signinAttempts';
        const attrName = this.customEl.propertyNameToAttributeName(propName);
        const observerName = this.customEl.properties[propName].observer;

        const str = `<${this.elName} ${attrName}="${value}" id="test"></${this.elName}>`;
        this.appEl.innerHTML = str;

        const el = document.getElementById('test');

        expect(el[propName]).toBe(value);
        expect(el.getAttribute(attrName)).toBe(`${value}`);
        expect(el[observerName].calls.count()).toBe(1);
        expect(el[observerName]).toHaveBeenCalledWith(undefined, value);
      });

      it('can initialise boolean property from attribute', function () {
        const value = true;
        const propName = 'valid';
        const attrName = this.customEl.propertyNameToAttributeName(propName);
        const observerName = this.customEl.properties[propName].observer;

        const str = `<${this.elName} ${value ? attrName : ''} id="test"></${this.elName}>`;
        this.appEl.innerHTML = str;

        const el = document.getElementById('test');

        expect(el[propName]).toBe(value);
        expect(el.hasAttribute(attrName)).toBe(value);
        expect(el[observerName].calls.count()).toBe(1);
        expect(el[observerName]).toHaveBeenCalledWith(undefined, value);
      });

      it('can initialise array property from attribute', function () {
        const value = ['d', 'e', 'f'];
        const propName = 'items';
        const attrName = this.customEl.propertyNameToAttributeName(propName);
        const observerName = this.customEl.properties[propName].observer;

        const str = `<${this.elName} ${attrName}='${JSON.stringify(value)}' id="test"></${this.elName}>`;
        this.appEl.innerHTML = str;

        const el = document.getElementById('test');

        expect(el[propName]).toEqual(value);
        expect(el.getAttribute(attrName)).toBe(JSON.stringify(value));
        expect(el[observerName].calls.count()).toBe(1);
        expect(el[observerName]).toHaveBeenCalledWith(undefined, value);
      });

      it('can initialise object property from attribute', function () {
        const value = { a: [], b: true };
        const propName = 'info';
        const attrName = this.customEl.propertyNameToAttributeName(propName);
        const observerName = this.customEl.properties[propName].observer;

        const str = `<${this.elName} ${attrName}='${JSON.stringify(value)}' id="test"></${this.elName}>`;
        this.appEl.innerHTML = str;

        const el = document.getElementById('test');

        expect(el[propName]).toEqual(value);
        expect(el.getAttribute(attrName)).toBe(JSON.stringify(value));
        expect(el[observerName].calls.count()).toBe(1);
        expect(el[observerName]).toHaveBeenCalledWith(undefined, value);
      })
    });
  });
};
