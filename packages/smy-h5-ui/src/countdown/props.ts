import type { ExtractPropTypes } from '@smy-h5/vtools'

export const props = {
  time: {
    type: [String, Number],
    default: 0,
  },
  format: {
    type: String,
    default: 'HH : mm : ss',
  },
  autoStart: {
    type: Boolean,
    default: true,
  },
  paused: {
    type: Boolean,
    default: false,
  },
}

export type CountdownProps = ExtractPropTypes<typeof props>
