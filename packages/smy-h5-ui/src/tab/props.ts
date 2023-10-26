import { ExtractPropTypes, numericProp, unknownProp } from '../_utils/vue/props'

export const props = {
  title: String,
  name: numericProp,
  badge: numericProp,
  disabled: Boolean,
  titleClass: unknownProp,
  titleStyle: unknownProp,
}

export type TabProps = ExtractPropTypes<typeof props>
