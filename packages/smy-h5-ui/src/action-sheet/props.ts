import { assign, keys } from '../_utils/shared'
import { ExtractPropTypes, componentProp, createArrayProp, truthProp } from '../_utils/vue/props'
import { popupSharedProps } from '../popup/shared'

export type ActionSheetItem = {
  name?: string
  subname?: string
  loading?: boolean
  disabled?: boolean
  color?: string
  className?: unknown
}

const popupInheritProps = assign(
  {
    round: truthProp,
  },
  popupSharedProps,
)

export const popupInheritPropKeys = keys(popupInheritProps)

export const props = assign(
  {
    title: String,
    items: createArrayProp<ActionSheetItem>(),
    closeIcon: componentProp,
    cancelText: String,
    desc: String,
    closeOnClickAction: Boolean,
  },
  popupInheritProps,
)

export type ActionSheetProps = ExtractPropTypes<typeof props>
