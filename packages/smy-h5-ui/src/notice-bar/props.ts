import { ExtractPropTypes, createNumericProp, createStringProp, truthProp } from '../_utils/vue/props'

export const props = {
  text: createStringProp(''),
  closable: Boolean,
  wrapable: Boolean,
  delay: createNumericProp(1),
  scrollable: truthProp,
  speed: createNumericProp(50),
}

export type NoticeBarProps = ExtractPropTypes<typeof props>
