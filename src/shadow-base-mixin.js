const CompostShadowMixin = (parent) => {
  return class extends parent {
    constructor() {
      super();

      this.attachShadow({ mode: 'open' });

      this.initialRender();

      this.$s = this.shadowRoot;
      this.$ = this.$s.querySelector.bind(this.$s);
      this.$$ = this.$s.querySelectorAll.bind(this.$s);
      this.$id = {};

      this.$$('[id]').forEach((el) => {
        this.$id[el.id] = el;
      });
    }

    initialRender() {}
    invalidate() {}
  }
};

export default CompostShadowMixin;
