import { ExtractPropTypes } from '@smy-h5/vooks'
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
} as const

export type CardProps = ExtractPropTypes<typeof props>
