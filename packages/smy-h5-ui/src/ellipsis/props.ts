import { createNumericProp, createStringProp, type ExtractPropTypes } from '../_utils/vue/props'
import type { PropType } from 'vue'

const ELLIPSIS_DIRECTION = ['start', 'end', 'middle'] as const

type EllipsisDirection = (typeof ELLIPSIS_DIRECTION)[number]

export const props = {
  content: createStringProp(''),
  direction: {
    type: String as PropType<EllipsisDirection>,
    validator: (str: EllipsisDirection) => ELLIPSIS_DIRECTION.includes(str),
    default: 'end',
  },
  rows: createNumericProp(1),
  expandText: createStringProp(''),
  collapseText: createStringProp(''),
  symbol: createStringProp('...'),
  lineHeight: createNumericProp(20),
}

export type EllipsisProps = ExtractPropTypes<typeof props>
