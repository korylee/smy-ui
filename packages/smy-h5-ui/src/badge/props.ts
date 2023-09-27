import { type PropType } from 'vue'
import { type ExtractPropTypes } from '../_utils/vue/props'

const BADGE_POSITIONS = ['right-top', 'right-bottom', 'left-top', 'left-bottom'] as const

type PositionType = (typeof BADGE_POSITIONS)[number]

export const props = {
  value: [String, Number],
  max: {
    type: [Number, String],
    defualt: 10000,
    validator: (val: string | number) => !Number.isNaN(+val),
  },
  dot: {
    type: Boolean,
    defualt: false,
  },
  bubble: {
    type: Boolean,
    default: false,
  },
  hidden: {
    type: Boolean,
    defualt: false,
  },
  top: {
    type: [String, Number],
    default: undefined,
  },
  right: {
    type: [String, Number],
    default: undefined,
  },
  zIndex: {
    type: [String, Number],
    default: undefined,
  },
  color: {
    type: String,
    default: undefined,
  },
  // 定位位置
  position: {
    type: String as PropType<PositionType>,
    default: 'right-top',
    validator: (val: PositionType) => BADGE_POSITIONS.includes(val),
  },
  transition: {
    type: String,
    default: 'smy-badge-fade',
  },
}

export type BadgeProps = ExtractPropTypes<typeof props>
