/**
 * Base class for other shadow mixins
 *
 * Attaches shadow root to current element, adds some helper properties
 * and adds method to initialise the shadow toot (implemented by sub classes)
 */

const CompostShadowBaseMixin = parent => (
  class extends parent {
    constructor() {
      super();

      this.attachShadow({ mode: 'open' });

      this.initialRender();

      this.$s = this.shadowRoot;
      this.$ = this.$s.querySelector.bind(this.$s);
      this.$$ = this.$s.querySelectorAll.bind(this.$s);

      // keep a map of all elements with ids
      this.$id = {};

      this.$$('[id]').forEach((el) => {
        this.$id[el.id] = el;
      });
    }

    // called once when element is initialised
    initialRender() {}

    // called on subsequent renders, if necessary
    invalidate() {}
  }
);

export default CompostShadowBaseMixin;
