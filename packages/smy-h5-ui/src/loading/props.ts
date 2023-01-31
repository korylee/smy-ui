import type { ExtractPropTypes } from '../_utils/vue/props'
import type { PropType } from 'vue'

const loadingTypes = ['circle', 'wave', 'cube', 'disappear'] as const

type LoadingTypes = typeof loadingTypes[number]

export const props = {
  type: {
    type: String as PropType<LoadingTypes>,
    default: 'circle',
    validator: (type: LoadingTypes) => loadingTypes.includes(type),
  },
  size: {
    type: [String, Number],
    default: '',
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
}

export type LoadingProps = ExtractPropTypes<typeof props>
