<p align="center">
  <img src="https://rawgit.com/lamplightdev/compost/master/images/compost.svg" alt="Logo" width="100">
  <br>
  <a href="https://www.npmjs.org/package/@lamplightdev/compost">
     <img src="https://img.shields.io/npm/v/@lamplightdev/compost.svg?style=flat" alt="npm">
  </a>
</p>

# compost

> A collection of small Web Component mixins to add commonly required functionality without the bloat

- **No dependencies** - just mixin and go
- **Plain JavaScript** - no build tools required, compatible by default, debug in the browser with standard dev tools
- **No magic** - straight forward to understand
- **Small & efficient** - low overhead to keep your components lean
- **Include only what you need** - take it or leave it
- **Cross browser** - works on all modern browsers and IE11

## Table of Contents

- [Install](#install)
- [Mixins](#mixins)
- [Usage](#usage)
- [Browser support](#browser-support)
- [Examples](#examples)
- [License](#license)

## Install

Install using [npm](https://npmjs.com):

```sh
npm install --save @lamplightdev/compost
```

## Mixins

### CompostShadowMixin

Adds a shadow DOM to your component. Takes a string returned from a `render()` method to set up the shadow DOM, and adds [ShadyCSS](https://github.com/webcomponents/shadycss) support if the polyfill is included for browsers that don't natively support shadow DOM. Also adds some convenience accessors for querying shadow DOM elements.

### CompostPropertiesMixin

Lets you specify your component's properties upfront, their types, whether their value should be reflected in an attribute, and an observer function to run when the property changes.

### CompostEventsMixin

Let's you add declarative event binding in your templates. Also adds some convenience methods for manual event binding and firing.

### CompostRepeatMixin

Stamps out a template for each object in the `items` array property

### CompostMixin

A convenience mixin that includes `CompostShadowMixin`, `CompostPropertiesMixin`, and `CompostEventsMixin`:

```js
const CompostMixin = (parent) => {
  return class extends
    CompostEventsMixin(
      CompostPropertiesMixin(
        CompostShadowMixin(parent))) {}
};
```

### Where's the data binding?

There is none. For simple, well structured components you may not need data binding - turns out you can get a lot done with the standard DOM APIs (and it's the most efficient way to update the DOM too). But if data binding is your thing you can simply extend `CompostShadowBaseMixin` to include your data binding library of choice (I like [lit-html](https://github.com/Polymer/lit-html).)

## Usage

### CompostShadowMixin

```html
<x-app></x-app>

<script>
  class App extends CompostShadowMixin(HTMLElement) {
    render() {
      return `
        <style>
          :host {
            display: flex;
            flex-direction: column;
            max-width: 1280px;
            margin: 0 auto;
          }
        </style>

        <button class="button" id="buttonEat">Eat me</button>
        <button class="button" id="buttonDrink">Drink me</button>
        <button class="button" id="buttonClick">Click me</button>
      `;
    }
  }

  customElements.define('x-app', App);
</script>
```
Implement a `render` method that returns a string - your x-app component now has a shadow DOM with encapsulated CSS.

In addition the following convenience properties are added:

`this.$s` is a reference to the shadow DOM

`this.$` is equivalent to `app.shadowRoot.querySelector`

`this.$$` is equivalent to `app.shadowRoot.querySelectorAll`

`this.$id` is an object containing a mapping of all elements with their `id`

### CompostPropertiesMixin

```html
<x-app></x-app>

<script>
  class App extends CompostPropertiesMixin(HTMLElement) {
    static get properties() {
      return {
        siteUsername: {
          type: String,
          value: 'lovelace',
          reflectToAttribute: true,
          observer: 'observeSiteUsername',
        },
      };
    }

    observeUser(oldValue, newValue) {
      console.log(oldValue, newValue);
    }
  }
</script>

```

Implement a static getter for `properties`, returning an object with the property name as the key, and the value an object containing:

|Key|Type|Default|Required|
|:--:|:--:|:--:|:--:|
|**`type`**|`{String\|Number\|Boolean\|Array\|Object}`|`String`|No|
|**`value`**|`{String\|Number\|Boolean\|Array\|Object\|null}`|`undefined`|No|
|**`reflectToAttribute`**|`{true\|false}`|`false`|No|
|**`observer`**|`{String}`|`undefined`|No|

`type`

The type of the property. Used when converting a property to an attribute, and vice-versa.

For boolean properties, `true` is converted to an empty attribute, while `false` removes the attribute. The presence of an attribute sets the property to `true`.

For array and object properties, the property is JSON stringified (`JSON.stringify`) when converting to an attribute, and JSON parsed (`JSON.parse`) when converting to a property.

`value`

The default value of the property if the property has not been initialised from an attribute, or the property was not set before the element was added to the DOM. If an attribute with a name matching the property name (converted to kebab-case) is present on the element this will always override the default.

`reflectToAttribute`

Whether the property should be reflected to an attribute with the same name. Camel cased property names (e.g. `siteUsername`) are converted to kebab cased attribute names (e.g. `site-username`) automatically.

`observer`

If defined, this is the name of a method in your class that will be called when the property changes with arguments containing the previous and new values. Strict equality is used when comparing old and new values, so changes in object sub properties or array elements won't trigger an observer - use of immutable data is advised.

The observer will also be called on initialisation - either from a matching attribute or a default `value`.

### CompostEventsMixin

```html
<x-app></x-app>

<script>
  class App extends CompostEventsMixin(CompostShadowMixin(HTMLElement)) {
    render() {
      return `
        <button on-click="test">Click me</button>
      `;
    }

    test(event) {
      console.log(this, event);
    }
  }

  customElements.define('x-app', App);
</script>
```

Any attribute beginning `on-{eventName}` (where eventName is one of [these standard DOM events](https://github.com/lamplightdev/compost/blob/86a15dd693112e6a6433a6262270f29a0869b5a3/src/events-mixin.js#L4)) will bind that event to the method specified in the attribute value (`test` in the example above.) The method is automatically bound to the current class, so `this` in the method will always refer to the class itself.

Event listeners are added in `connectedCallback` and removed in `disconnectedCallback`.

In addition the following convenience methods are added:

`this.on(el, type, func)` is equivalent to `el.addEventListener(type, func)`

`this.off(el, type, func)` is equivalent to `el.removeEventListener(type, func)`

`this.fire(type, detail, bubbles = true, composed = true)` is equivalent to
```js
this.dispatchEvent(new CustomEvent(type, {
  bubbles,
  composed,
  detail,
}));
```

### CompostRepeatMixin

```html
<x-app></x-app>

<script>
  class App extends CompostRepeatMixin(CompostShadowMixin(HTMLElement)) {
    render() {
      return super.render(`
        <h1>Repeater<h1>
      `, `
        <button></button>
      `);
    }

    getKey(value, index) {
      return value;
    }

    updateItem(el, value, index) {
      el.textContent = value;
    }
  }

  customElements.define('x-app', App);

  const app = document.querySelector('x-app');
  app.items = ['one', 'two', 'three'];
</script>
```

The first argument to `render` is anything that needs to be in the element's shadow DOM (which is not repeated.) The second argument is the DOM  that needs to be repeated and is combined with the `items` array property to stamp out new elements in the light DOM. So the above will output a custom element with `<h1>Repeater</h1>` in the shadow DOM, and the following in a `slot`:

```html
<button>one</button>
<button>two</button>
<button>three</button>
```

`this.getKey(value, index)` must return a unique key for each `value` in `items` so that items can be efficiently added/removed/reordered when the items array changes.

`updateItem(el, value, index)` is used to update the repeated element when the `value` in `items[index]` changes.

## Browser support

Works with no polyfills or build step for browsers that support ES2015, Shadow DOM v1, Custom Elements v1 and HTML Templates. This is currently the latest versions of Chrome and Safari.

Works with other browsers down to IE11 when using the [web components polyfills](https://github.com/WebComponents/webcomponentsjs) and a transpilation step (e.g. Babel) as needed.

## Examples

[HackerNew Progressive Web App](https://compost-hn.netlify.com) -  built using compost

Coming soon - an example using lit-html.

Coming soon - an example that works on all browsers down to IE11.

## License

[MIT License](https://oss.ninja/mit/lamplightdev) © [Chris Haynes](https://lamplightdev.com)
