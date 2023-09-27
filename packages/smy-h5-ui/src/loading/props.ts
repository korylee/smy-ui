import type { ExtractPropTypes } from '../_utils/vue/props'
import type { PropType } from 'vue'

const loadingTypes = ['circle', 'wave', 'cube'] as const

type LoadingType = (typeof loadingTypes)[number]

export const props = {
  type: {
    type: String as PropType<LoadingType>,
    default: 'circle',
    validator: (type: LoadingType) => loadingTypes.includes(type),
  },
  size: {
    type: [String, Number],
    default: 16,
  },
  color: {
    type: String,
    default: 'currentColor',
  },
  desc: String,
  loading: {
    type: Boolean,
    default: false,
  },
}

export type LoadingProps = ExtractPropTypes<typeof props>
