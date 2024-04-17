import type { PropType } from 'vue'
import { ExtractPropTypes, createContainProp, numericProp, truthProp } from '../_utils/vue/props'
import type { LazyloadOptions } from '../lazyload'

const IMAGE_FIT = ['fill', 'contain', 'cover', 'none', 'scale-down'] as const

export type ImageFit = (typeof IMAGE_FIT)[number]

export const props = {
  src: String,
  alt: String,
  fit: createContainProp(IMAGE_FIT),
  block: truthProp,
  width: numericProp,
  height: numericProp,
  radius: numericProp,
  lazy: Boolean,
  lazyOptions: Object as PropType<LazyloadOptions>,
}

export type ImageProps = ExtractPropTypes<typeof props>
