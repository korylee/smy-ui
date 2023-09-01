import { ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  title: String,
  name: String,
}

export type TabProps = ExtractPropTypes<typeof props>
