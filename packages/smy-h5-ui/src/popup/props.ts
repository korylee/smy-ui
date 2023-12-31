import { assign } from '../_utils/shared'
import { ExtractPropTypes } from '../_utils/vue/props'
import type { PropType } from 'vue'
import { popupSharedProps } from './shared'

const POPUP_POSITIONS = ['top', 'bottom', 'center', 'left', 'right'] as const

export type PopupPosition = (typeof POPUP_POSITIONS)[number]

export const props = assign(
  {
    position: {
      type: String as PropType<PopupPosition>,
      default: 'center',
      validator: (str: PopupPosition) => POPUP_POSITIONS.includes(str),
    },
    transition: String,
    wrapperClass: [String, Object, Array],
    contentClass: [String, Object, Array],
    contentStyle: [String, Object, Array],
    round: Boolean,
    safeAreaInsetTop: Boolean,
    safeAreaInsetBottom: Boolean,
  },
  popupSharedProps,
)

export type PopupProps = ExtractPropTypes<typeof props>
