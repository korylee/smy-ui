import { createContainProp, createNumericProp, createStringProp, type ExtractPropTypes } from '../_utils/vue/props'

const ELLIPSIS_DIRECTION = ['end', 'start', 'middle'] as const

export const props = {
  content: createStringProp(''),
  direction: createContainProp(ELLIPSIS_DIRECTION),
  rows: createNumericProp(1),
  expandText: createStringProp(''),
  collapseText: createStringProp(''),
  symbol: createStringProp('...'),
  lineHeight: createNumericProp(20),
}

export type EllipsisProps = ExtractPropTypes<typeof props>
