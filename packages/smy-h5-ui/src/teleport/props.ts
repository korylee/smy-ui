import type { ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  to: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
}

export type TeleportProps = ExtractPropTypes<typeof props>
