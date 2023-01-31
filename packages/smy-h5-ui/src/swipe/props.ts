import type { ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  disabled: Boolean,
}

export type SwipeProps = ExtractPropTypes<typeof props>
