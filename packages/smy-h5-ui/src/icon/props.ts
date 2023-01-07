import type { ExtractPropTypes } from '@smy-h5/vtools'

export const props = {
  size: [String, Number],
  color: String,
  tag: String,
}

export type IconProps = ExtractPropTypes<typeof props>
