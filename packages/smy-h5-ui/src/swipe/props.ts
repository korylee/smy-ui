import type { ExtractPropTypes } from '@smy-h5/vtools'

export const props = {
  disabled: Boolean,
}

export type SwipeProps = ExtractPropTypes<typeof props>
