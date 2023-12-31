import { ExtractPropTypes, createNumericProp, createStringProp, truthProp } from '../_utils/vue/props'

export const props = {
  text: createStringProp(''),
  closeable: Boolean,
  wrapable: Boolean,
  delay: createNumericProp(1000), // ms
  scrollable: truthProp,
  speed: createNumericProp(50),
}

export type NoticeBarProps = ExtractPropTypes<typeof props>
