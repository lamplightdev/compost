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

There is none. For simple, well structured components there's not always a need for data binding - turns out you can get a lot done with the standard DOM APIs (and it's the most efficient way to update the DOM). But if data binding is your thing, you can simply extend `CompostShadowBaseMixin` to include your data binding library of choice (I like [lit-html](https://github.com/Polymer/lit-html))

## Usage

## Examples

[HackerNew Progressive Wev App](https://compost-hn.netlify.com) -  built using compost

## License

[MIT License](https://oss.ninja/mit/lamplightdev) © [Chris Haynes](https://lamplightdev.com)
