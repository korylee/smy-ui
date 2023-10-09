import { ExtractPropTypes, numericProp } from '../_utils/vue/props'

export const props = {
  title: String,
  name: numericProp,
  badge: numericProp,
  disabled: Boolean,
}

export type TabProps = ExtractPropTypes<typeof props>
