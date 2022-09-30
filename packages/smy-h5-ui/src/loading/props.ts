import { ExtractPropTypes } from '@smy-h5/vooks'
import { PropType } from 'vue'

const loadingTypes = ['circle', 'wave', 'cube', 'disappear'] as const

const loadingSize = ['normal', 'mini', 'small', 'large'] as const

type LoadingTypes = typeof loadingTypes[number]

type LoadingSize = typeof loadingSize[number]

export const props = {
  type: {
    type: String as PropType<LoadingTypes>,
    default: 'circle',
    validator: (type: LoadingTypes) => loadingTypes.includes(type),
  },
  radius: {
    type: [String, Number],
  },
  size: {
    type: String as PropType<LoadingSize>,
    default: 'normal',
    validator: (size: LoadingSize) => loadingSize.includes(size),
  },
  color: {
    type: String,
    default: 'currentColor',
  },
  description: String,
  loading: {
    type: Boolean,
    default: false,
  },
} as const

export type LoadingProps = ExtractPropTypes<typeof props>
