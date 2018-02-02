import CompostShadowBaseMixin from './shadow-base-mixin.js';

const CompostShadowMixin = (parent) => {
  return class extends CompostShadowBaseMixin(parent) {
    render() {
      return '';
    }

    initialRender() {
      let instance;

      const templateString = this.render();
      const template = document.createElement('template');
      template.innerHTML = templateString;

      if (window.ShadyCSS && !window.ShadyCSS.nativeShadow) {
        window.ShadyCSS.prepareTemplate(template, this.nodeName.toLowerCase());
        window.ShadyCSS.styleElement(this);
      }

      instance = template.content.cloneNode(true);

      this.shadowRoot.appendChild(instance);
    }

    invalidate() {}
  }
}

export default CompostShadowMixin;
