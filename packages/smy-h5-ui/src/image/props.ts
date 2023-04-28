import { PropType } from 'vue'
import { ExtractPropTypes } from '../_utils/vue/props'
import { LazyloadOptions } from '../lazyload'

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
  lazy: Boolean,
  lazyOptions: Object as PropType<LazyloadOptions>,
}

export type ImageProps = ExtractPropTypes<typeof props>
