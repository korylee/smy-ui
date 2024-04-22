import { ExtractPropTypes, elProp } from '../_utils/vue/props'

export const props = {
  to: elProp,
  disabled: Boolean,
}

export type TeleportProps = ExtractPropTypes<typeof props>
