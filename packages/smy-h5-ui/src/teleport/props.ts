import type { ExtractPropTypes } from '@smy-h5/vtools'

export const props = {
  to: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
} as const

export type TeleportProps = ExtractPropTypes<typeof props>
