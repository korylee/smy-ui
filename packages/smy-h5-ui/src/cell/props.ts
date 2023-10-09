import { ExtractPropTypes, numericProp, unknownProp } from '../_utils/vue/props'

export const props = {
  title: numericProp,
  desc: String,
  border: Boolean,
  titleClass: unknownProp,
  descClass: unknownProp,
  extraClass: unknownProp,
  clickable: Boolean,
  insert: Boolean,
}

export type CellProps = ExtractPropTypes<typeof props>
