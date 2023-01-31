import type { ExtractPropTypes } from '../_utils/vue/props'
import type { PropType } from 'vue'

const fitType = ['fill', 'contain', 'cover', 'none', 'scale-down'] as const
type FitType = typeof fitType[number]

const fitValidator = (fit: FitType) => fitType.includes(fit)

export const props = {
  src: {
    type: String,
  },
  fit: {
    type: String as PropType<FitType>,
    validator: fitValidator,
    default: 'cover',
  },
  height: [String, Number],
  alt: String,
  title: String,
  subtitle: String,
  content: String,
  elevation: [Number, String],
  // ripple: {
  //   type: Boolean,
  //   default: false,
  // },
  // onClick: {
  //   type: Function as PropType<(e: Event) => void>,
  // },
} as const

export type CardProps = ExtractPropTypes<typeof props>
