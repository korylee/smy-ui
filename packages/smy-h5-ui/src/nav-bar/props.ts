import { PropType } from 'vue'
import { ExtractPropTypes, componentProp, truthProp } from '../_utils/vue/props'

export const props = {
  title: String,
  fixed: Boolean,
  border: truthProp,
  placeholder: Boolean,
  leftText: String,
  rightText: String,
  leftDisabled: Boolean,
  rightDisabled: Boolean,
  leftArrow: [Boolean].concat(componentProp as any) as PropType<typeof componentProp | boolean>,
  clickable: truthProp,
  safeAreaInsetTop: Boolean,
}

export type NavBarProps = ExtractPropTypes<typeof props>
