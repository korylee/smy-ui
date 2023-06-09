import type { ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  title: [String, Number],
  desc: String,
  border: Boolean,
  titleClass: String,
  descClass: String,
  extraClass: String,
  clickable: Boolean,
  insert: Boolean,
}

export type CellProps = ExtractPropTypes<typeof props>
