import { createContainProp, createNumericProp, createStringProp, type ExtractPropTypes } from '../_utils/vue/props'

export const LOADING_TYPES = ['circle', 'wave', 'cube'] as const

export const props = {
  type: createContainProp(LOADING_TYPES),
  size: createNumericProp(16),
  color: createStringProp('currentColor'),
  desc: String,
  loading: {
    type: Boolean,
    default: false,
  },
}

export type LoadingProps = ExtractPropTypes<typeof props>
