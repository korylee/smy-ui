import { type PropType } from 'vue'
import { type ExtractPropTypes } from '../_utils/vue/props'

const JUSTIFY_OPTIONS = ['flex-start', 'flex-end', 'center', 'space-between', 'space-around'] as const

const ALIGN_OPTIONS = ['flex-start', 'flex-end', 'center'] as const

const WRAP_OPTIONS = ['wrap', 'nowrap', 'reverse'] as const

type JustifyType = typeof JUSTIFY_OPTIONS[number]

type AlignType = typeof ALIGN_OPTIONS[number]

type WrapType = typeof WRAP_OPTIONS[number]

export const props = {
  gutter: {
    type: [String, Number],
    default: 0,
  },
  justify: {
    type: String as PropType<JustifyType>,
    defualt: 'flex-start',
    validator: (str: JustifyType) => JUSTIFY_OPTIONS.includes(str),
  },
  align: {
    type: String as PropType<AlignType>,
    default: 'flex-start',
    validator: (str: AlignType) => ALIGN_OPTIONS.includes(str),
  },
  wrap: {
    type: String as PropType<WrapType>,
    default: 'nowrap',
    validator: (str: WrapType) => WRAP_OPTIONS.includes(str),
  },
}

export type RowProps = ExtractPropTypes<typeof props>
