import { ExtractPropTypes, createStringProp } from '../_utils/vue/props'

export const props = {
  title: createStringProp(''),
  content: createStringProp(''),
}

export type StepProps = ExtractPropTypes<typeof props>
