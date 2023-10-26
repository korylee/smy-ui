import { assign } from '../_utils/shared'
import { ExtractPropTypes, createArrayProp, createNumericProp, truthProp } from '../_utils/vue/props'
import { pickerPopupProps, pickerToolbarProps } from '../picker/props'

export const props = assign(
  {
    popup: truthProp,
    tabs: createArrayProp<string>(),
    activeTab: createNumericProp(0),
    nextStepText: String,
  },
  pickerToolbarProps,
  pickerPopupProps
)

export type PickerGroupProps = ExtractPropTypes<typeof props>
