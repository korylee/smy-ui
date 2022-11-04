import VertScroll from './VerticalScroll.vue'
import { props, VERT_PROP_KEYS } from './props'
import { pick } from '../_utils/shared'

import '../_styles/common.less'
import './scroller.less'

export default {
  name: 'SmyScroller',
  functional: true,
  components: { VertScroll },
  props,
  render(h, { props, listeners, slots, scopedSlots }) {
    slots = slots()
    if (props.type === 'vertical') {
      return (
        <VertScroll
          {...{
            props: pick(props, VERT_PROP_KEYS),
            on: pick(listeners, ['loadMore', 'pulldown', 'scrollToCb', 'scrollChange']),
          }}
        >
          {slots.default ?? scopedSlots.default?.()}
        </VertScroll>
      )
    }
    return <div>暂不支持横版</div>
  },
}
