import { type PropType } from 'vue'
import { type ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  value: Boolean,
  options: {
    type: Object as PropType<IntersectionObserverInit>,
    default: () => ({}),
  },
  tag: {
    type: String,
    default: 'div',
  },
  transition: {
    type: String,
    default: 'smy-fade',
  },
  keepShow: Boolean,
}

export type LazyProps = ExtractPropTypes<typeof props>
