import type { ExtractPropTypes } from '../_utils/vue/props'
import type { PropType } from 'vue'

const ELLIPSIS_DIRECTION = ['start', 'end', 'middle'] as const

type EllipsisDirection = typeof ELLIPSIS_DIRECTION[number]

export const props = {
  content: {
    type: String,
    default: '',
  },
  direction: {
    type: String as PropType<EllipsisDirection>,
    validator: (str: EllipsisDirection) => ELLIPSIS_DIRECTION.includes(str),
    default: 'end',
  },
  rows: {
    type: [Number, String],
    default: 1,
  },
  expandText: {
    type: String,
    default: '',
  },
  collapseText: {
    type: String,
    default: '',
  },
  symbol: {
    type: String,
    default: '...',
  },
  lineHeight: {
    type: [Number, String],
    default: 20,
  },
}

export type EllipsisProps = ExtractPropTypes<typeof props>
