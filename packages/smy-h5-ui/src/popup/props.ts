import { assign } from '@smy-h5/shared'
import { ExtractPropTypes, createContainProp } from '../_utils/vue/props'
import { popupSharedProps } from './shared'

const POPUP_POSITIONS = ['center', 'top', 'bottom', 'left', 'right'] as const

export type PopupPosition = (typeof POPUP_POSITIONS)[number]

export const props = assign(
  {
    position: createContainProp(POPUP_POSITIONS),
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
