/**
 * A mixin to initialise the shadow root with a template formed from a string
 */

import CompostShadowBaseMixin from './shadow-base-mixin.js';

// cache templates
const templateCache = {};

const CompostShadowMixin = parent => (
  class extends CompostShadowBaseMixin(parent) {

    /**
     * return the template string to be rendered
     */
    render() {
      return '';
    }

    initialRender() {
      let template;

      if (templateCache[this.tagName]) {
        template = templateCache[this.tagName];
      } else {
        // create template element from string
        const templateString = this.render();
        template = document.createElement('template');
        template.innerHTML = templateString;

        // if no native shadow dom and polyfill included, use it
        if (window.ShadyCSS && !window.ShadyCSS.nativeShadow) {
          window.ShadyCSS.prepareTemplate(template, this.nodeName.toLowerCase());
          window.ShadyCSS.styleElement(this);
        }

        templateCache[this.tagName] = template;
      }

      const instance = template.content.cloneNode(true);

      this.shadowRoot.appendChild(instance);
    }

    // no data binding, so invalidate is a no-op
    invalidate() {}
  }
);

export default CompostShadowMixin;
