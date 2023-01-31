import type { ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  size: [String, Number],
  color: String,
  tag: String,
}

export type IconProps = ExtractPropTypes<typeof props>
