import CompostShadowMixin from './shadow-mixin.js';
import CompostPropertiesMixin from './properties-mixin.js';
import CompostEventsMixin from './events-mixin.js';

/**
 * Convenience mixin containing the 3 main Compost mixins
 *
 */
const CompostMixin = parent => (
  class extends
    CompostEventsMixin(CompostPropertiesMixin(CompostShadowMixin(parent))) {}
);

export default CompostMixin;
