import { assign, pick } from '@smy-h5/shared'
import { props as swiperProps } from '../swiper/props'
import { props as popupProps } from '../popup/props'
import {
  ExtractPropTypes,
  createArrayProp,
  createComponentProp,
  createNumericProp,
  createStringProp,
} from '../_utils/vue/props'
// @ts-ignore
import WindowClose from '@smy-h5/icons/dist/es/WindowClose'

export type Image = string

const CLOSE_ICON_POSITION = ['top-right', 'bottom-right', 'top-left', 'bottom-left'] as const

type CloseIconPosition = (typeof CLOSE_ICON_POSITION)[number]

const baseProps = {
  show: {
    type: Boolean,
    defualt: false,
  },
  images: createArrayProp<Image>(),
  zoom: createNumericProp(2),
  closeable: Boolean,
  closeIcon: createComponentProp(WindowClose),
  closeIconPosition: createStringProp<CloseIconPosition>('top-right'),
}

export const props = assign(
  baseProps,
  pick(swiperProps, ['loop', 'autoplay', 'initialIndex', 'indicator']),
  pick(popupProps, ['lockScroll', 'teleport']),
)

export type ImagePreviewProps = ExtractPropTypes<typeof props>
