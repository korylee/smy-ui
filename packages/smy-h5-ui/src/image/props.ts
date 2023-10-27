import type { PropType } from 'vue'
import { ExtractPropTypes, truthProp } from '../_utils/vue/props'
import type { LazyloadOptions } from '../lazyload'

const IMAGE_FIT = ['fill', 'contain', 'cover', 'none', 'scale-down'] as const

export type ImageFit = (typeof IMAGE_FIT)[number]

export const props = {
  src: String,
  alt: String,
  fit: {
    type: String as PropType<ImageFit>,
    default: 'fill',
    validator: (val: ImageFit) => IMAGE_FIT.includes(val),
  },
  block: truthProp,
  width: [String, Number],
  height: [String, Number],
  radius: [String, Number],
  lazy: Boolean,
  lazyOptions: Object as PropType<LazyloadOptions>,
}

export type ImageProps = ExtractPropTypes<typeof props>
