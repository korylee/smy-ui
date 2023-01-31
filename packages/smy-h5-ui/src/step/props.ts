import type { ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  title: { type: String, defualt: '' },
  content: { type: String, default: '' },
}

export type StepProps = ExtractPropTypes<typeof props>
