import { assign } from '@smy-h5/shared'
import { ExtractPropTypes, createArrayProp, createNumericProp, truthProp } from '../_utils/vue/props'
import { pickerToolbarProps } from '../picker/props'
import { popupSharedProps } from '../popup/shared'

export const props = assign(
  {
    popup: truthProp,
    tabs: createArrayProp<string>(),
    activeTab: createNumericProp(0),
    nextStepText: String,
  },
  pickerToolbarProps,
  popupSharedProps,
)

export type PickerGroupProps = ExtractPropTypes<typeof props>
