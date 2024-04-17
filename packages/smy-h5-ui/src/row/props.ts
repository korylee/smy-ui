import { createContainProp, createNumericProp, type ExtractPropTypes } from '../_utils/vue/props'

const JUSTIFY_OPTIONS = ['flex-start', 'flex-end', 'center', 'space-between', 'space-around'] as const

const ALIGN_OPTIONS = ['flex-start', 'flex-end', 'center'] as const

const WRAP_OPTIONS = ['nowrap', 'wrap', 'reverse'] as const

export const props = {
  gutter: createNumericProp(0),
  justify: createContainProp(JUSTIFY_OPTIONS),
  align: createContainProp(ALIGN_OPTIONS),
  wrap: createContainProp(WRAP_OPTIONS),
}

export type RowProps = ExtractPropTypes<typeof props>
