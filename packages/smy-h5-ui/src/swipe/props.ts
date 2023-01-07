import type { ExtractPropTypes } from '@smy-h5/vtools'

export const props = {
  disabled: Boolean,
  touchMoveStopPropagation: {
    type: Boolean,
    default: false,
  },
}

export type SwipeProps = ExtractPropTypes<typeof props>
