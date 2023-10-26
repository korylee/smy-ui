import { ExtractPropTypes, createStringProp, createUnknownProp, numericProp, truthProp } from '../_utils/vue/props'

export const props = {
  value: createUnknownProp(false),
  disabled: Boolean,
  size: numericProp,
  activeColor: createStringProp(''),
  inactiveColor: createStringProp(''),
  activeLabel: createStringProp(''),
  inactiveLabel: createStringProp(''),
  activeValue: createUnknownProp(true),
  inactiveValue: createUnknownProp(false),
  loading: Boolean,
  loadingColor: String,
  loadingSize: numericProp,
  isStopPropagation: truthProp,
}

export type SwtichProps = ExtractPropTypes<typeof props>
