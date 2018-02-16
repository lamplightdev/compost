import CompostShadowBaseMixin from './shadow-base-mixin.js';

const templateCache = {};

const CompostShadowMixin = parent => (
  class extends CompostShadowBaseMixin(parent) {
    render() {
      return '';
    }

    initialRender() {
      let template;

      if (templateCache[this.tagName]) {
        template = templateCache[this.tagName];
      } else {
        const templateString = this.render();
        template = document.createElement('template');
        template.innerHTML = templateString;

        if (window.ShadyCSS && !window.ShadyCSS.nativeShadow) {
          window.ShadyCSS.prepareTemplate(template, this.nodeName.toLowerCase());
          window.ShadyCSS.styleElement(this);
        }

        templateCache[this.tagName] = template;
      }

      const instance = template.content.cloneNode(true);

      this.shadowRoot.appendChild(instance);
    }

    invalidate() { }
  }
);

export default CompostShadowMixin;
