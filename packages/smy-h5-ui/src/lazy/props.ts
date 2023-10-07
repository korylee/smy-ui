import { type PropType } from 'vue'
import { createStringProp, type ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  value: Boolean,
  options: {
    type: Object as PropType<IntersectionObserverInit>,
    default: () => ({}),
  },
  tag: createStringProp('div'),
  transition: createStringProp('smy-fade'),
  keepShow: Boolean,
}

export type LazyProps = ExtractPropTypes<typeof props>
