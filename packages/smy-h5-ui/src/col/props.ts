import { type ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  span: {
    type: [String, Number],
    default: 24,
  },
  offset: {
    type: [String, Number],
    default: 0,
  },
}

export type ColProps = ExtractPropTypes<typeof props>
