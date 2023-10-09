import { ExtractPropTypes, elProp } from '../_utils/vue/props'

export const props = {
  to: {
    type: elProp,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
}

export type TeleportProps = ExtractPropTypes<typeof props>
