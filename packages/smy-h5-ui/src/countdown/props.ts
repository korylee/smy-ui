import { ExtractPropTypes, createStringProp, truthProp } from '../_utils/vue/props'

export const props = {
  time: {
    type: [String, Number],
    default: 0,
  },
  format: createStringProp('HH : mm : ss'),
  autoStart: truthProp,
  paused: {
    type: Boolean,
    default: false,
  },
}

export type CountdownProps = ExtractPropTypes<typeof props>
