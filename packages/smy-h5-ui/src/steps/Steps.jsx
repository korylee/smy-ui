import { getSlot } from '../_utils/vue/slots'
import { createParentMixin } from '../_mixins/relation'
import { props } from './props'

import './steps.less'

export default {
  name: 'SmySteps',
  mixins: [createParentMixin('steps', { children: 'step' })],
  props,
  computed: {
    classes() {
      return {
        'smy-steps': true,
        [`smy-steps--${this.direction}`]: this.direction,
        'smy-steps--dot': this.progressDot,
      }
    },
    direction() {
      return this.vertical ? 'vertical' : 'horizontal'
    },
  },
  render() {
    return <div class={this.classes}>{getSlot(this)}</div>
  },
}
