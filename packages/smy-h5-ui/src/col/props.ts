import { createNumericProp, type ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  span: createNumericProp(24),
  offset: createNumericProp(0),
}

export type ColProps = ExtractPropTypes<typeof props>
