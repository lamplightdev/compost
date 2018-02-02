import CompostShadowMixin from './shadow-mixin.js';
import CompostPropertiesMixin from './properties-mixin.js';
import CompostEventsMixin from './events-mixin.js';

const CompostMixin = (parent) => {
  return class extends
    CompostEventsMixin(
      CompostPropertiesMixin(
        CompostShadowMixin(parent))) {}
};

export default CompostMixin;
