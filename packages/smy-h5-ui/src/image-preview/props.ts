import { assign, pick } from '../_utils/shared'
import { props as swiperProps } from '../swiper/props'
import { props as popupProps } from '../popup/props'
import { ExtractPropTypes, createArrayProp, createNumericProp, createStringProp } from '../_utils/vue/props'

export type Image = string

const CLOSE_ICON_POSITION = ['top-right', 'bottom-right', 'top-left', 'bottom-left'] as const

type CloseIconPosition = typeof CLOSE_ICON_POSITION[number]

const baseProps = {
  show: {
    type: Boolean,
    defualt: false,
  },
  images: createArrayProp<Image>(),
  zoom: createNumericProp(2),
  closeable: {
    type: Boolean,
    default: false,
  },
  closeIcon: createStringProp('window-close'),
  closeIconPosition: createStringProp<CloseIconPosition>('top-right'),
}

export const props = assign(
  baseProps,
  pick(swiperProps, ['loop', 'autoplay', 'initialIndex', 'indicator']),
  pick(popupProps, ['lockScroll', 'teleport'])
)

export type ImagePreviewProps = ExtractPropTypes<typeof props>
