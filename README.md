<p align="center">
  <img src="https://rawgit.com/lamplightdev/compost/master/images/compost.svg" alt="Logo" width="100">
  <br>
  <a href="https://www.npmjs.org/package/@lamplightdev/compost">
     <img src="https://img.shields.io/npm/v/@lamplightdev/compost.svg?style=flat" alt="npm">
  </a>
</p>

# compost

> A collection of small Web Component mixins to add commonly required functionality without the bloat

- **No dependencies** just mixin and go
- **Plain old JavaScript** no build tools required, compatible by default, debug in the browser with standard dev tools
- **No magic** straight forward to understand
- **Small & efficient** low overhead to keep your components lean
- **Include only what you need** take it or leave it
- **Cross browser** works on all modern browsers and IE11

## Table of Contents

- [Install](#install)
- [Mixins](#mixins)
- [Usage](#usage)
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

Stamps out a template for each object in the `items` array property.

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

There is none. For simple, well structured components you may not need data binding - turns out you can get a lot done with the standard DOM APIs (and it's the most efficient way to update the DOM too). But if data binding is your thing, you can simply extend `CompostShadowBaseMixin` to include your data binding library of choice (I like [lit-html](https://github.com/Polymer/lit-html))

## Usage

### CompostShadowMixin

```html

<x-app></x-app>

<script>
  class App extends CompostMixin(HTMLElement) {
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

  const app = document.querySelector('x-app');
</script>
```
Implement a `render` method that returns a string - your x-app component now has a shadow DOM with encapsulated CSS. In addition:

> `app.$s` is a reference to the shadow DOM

> `app.$` is equivalent to `app.shadowRoot.querySelector`

> `app.$$` is equivalent to `app.shadowRoot.querySelectorAll`

> `app.$id` is an object containing a mapping of all elements with their `id`

### CompostPropertiesMixin

```html

<x-app></x-app>

<script>
  class App extends CompostMixin(HTMLElement) {
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

If defined, this is the name of a method in your class that will be called when the property changes with arguments containing the previous and new values. Strict equality is used when comparing old and new values, so changes in object sub properties (e.g. `a.b`) won't trigger an observer - use of immutable data is advised.

The observer will also be called on initialisation either from a matching attribute or a default `value`.

### CompostEventsMixin

### CompostRepeatMixin

## Examples

[HackerNew Progressive Wev App](https://compost-hn.netlify.com) -  built using compost

## License

[MIT License](https://oss.ninja/mit/lamplightdev) © [Chris Haynes](https://lamplightdev.com)
