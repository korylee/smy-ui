import { type PropType } from 'vue'
import { createStringProp, type ExtractPropTypes } from '../_utils/vue/props'
import { Numeric } from '../_utils/is'
import { numericProp } from '../_utils/vue/props'

const BADGE_POSITIONS = ['top-right', 'bottom-right', 'top-left', 'bottom-left'] as const

type PositionType = (typeof BADGE_POSITIONS)[number]

export const props = {
  value: [String, Number],
  max: {
    type: numericProp,
    defualt: 10000,
    validator: (val: string | number) => !Number.isNaN(+val),
  },
  bubble: {
    type: Boolean,
    default: false,
  },
  hidden: {
    type: Boolean,
    defualt: false,
  },
  /**
   * @deprecated
   */
  dot: Boolean,
  offset: Array as unknown as PropType<[Numeric, Numeric]>,
  color: String,
  // 定位位置
  position: {
    type: String as PropType<PositionType>,
    default: 'top-right',
    validator: (val: PositionType) => BADGE_POSITIONS.includes(val),
  },
  transition: createStringProp('smy-badge-fade'),
}

export type BadgeProps = ExtractPropTypes<typeof props>
