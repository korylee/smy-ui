import { ExtractPropTypes, createStringProp } from '../_utils/vue/props'

export const props = {
  errorMessage: createStringProp(''),
  extraMessage: createStringProp(''),
}

export type FormDetailsProps = ExtractPropTypes<typeof props>
