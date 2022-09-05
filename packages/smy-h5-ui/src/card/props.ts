import { ExtractPropTypes, PropType } from '@smy-h5/vooks'
const fitValidator = (fit: string) => ['fill', 'contain', 'cover', 'none', 'scale-down'].includes(fit)

export const props = {
  src: {
    type: String,
  },
  fit: {
    type: String as PropType<'fill' | 'contain' | 'cover' | 'none' | 'scale-down'>,
    validator: fitValidator,
    default: 'cover',
  },
}

export type CardProps = ExtractPropTypes<typeof props>
