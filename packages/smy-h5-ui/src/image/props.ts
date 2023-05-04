import type { PropType } from 'vue'
import type { ExtractPropTypes } from '../_utils/vue/props'
import type { LazyloadOptions } from '../lazyload'

const FIT = ['fill', 'contain', 'cover', 'none', 'scale-down'] as const

type FitType = typeof FIT[number]

export const props = {
  src: String,
  alt: String,
  fit: {
    type: String as PropType<FitType>,
    default: 'fill',
    validator: (val: FitType) => FIT.includes(val),
  },
  block: {
    type: Boolean,
    default: true,
  },
  width: [String, Number],
  height: [String, Number],
  radius: [String, Number],
  lazy: Boolean,
  lazyOptions: Object as PropType<LazyloadOptions>,
}

export type ImageProps = ExtractPropTypes<typeof props>
