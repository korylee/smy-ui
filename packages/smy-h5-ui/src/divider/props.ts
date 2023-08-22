import { ExtractPropTypes, createStringProp, truthProp } from '../_utils/vue/props'

export const props = {
  dashed: Boolean,
  hairline: truthProp,
  vertical: Boolean,
  contentPosition: createStringProp('center'),
}

export type DividerProps = ExtractPropTypes<typeof props>
