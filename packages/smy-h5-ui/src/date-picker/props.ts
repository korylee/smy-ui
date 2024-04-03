import { PropType } from 'vue'
import { PickerBaseColumnItem, pickerSharedProps } from '../picker/props'
import { isDate, assign } from '@smy-h5/shared'
import { ExtractPropTypes, createArrayProp } from '../_utils/vue/props'

const DATE_PICKER_COLUMN_TYPE = ['year', 'month', 'day'] as const

export type DatePickerColumnType = (typeof DATE_PICKER_COLUMN_TYPE)[number]

const currentYear = new Date().getFullYear()

export type TimePickerColumnItem = PickerBaseColumnItem & { type: DatePickerColumnType }

export const props = assign(
  {
    value: createArrayProp<string>(),
    columnsType: { type: Array as PropType<DatePickerColumnType[]>, default: () => DATE_PICKER_COLUMN_TYPE },
    minDate: { type: Date, default: () => new Date(currentYear - 10, 0, 1), validator: isDate },
    maxDate: { type: Date, default: () => new Date(currentYear + 10, 11, 31), validator: isDate },
    formatter: {
      type: Function as PropType<(item: TimePickerColumnItem) => TimePickerColumnItem>,
      default: (item: TimePickerColumnItem) => item,
    },
    filter: Function as PropType<(item: TimePickerColumnItem) => boolean>,
  },
  pickerSharedProps,
)

export type DatePickerProps = ExtractPropTypes<typeof props>
