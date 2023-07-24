import { createNumericProp, createStringProp, truthProp, type ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  time: createNumericProp(0),
  format: createStringProp('HH : mm : ss'),
  autoStart: truthProp,
  paused: {
    type: Boolean,
    default: false,
  },
}

export type CountdownProps = ExtractPropTypes<typeof props>
