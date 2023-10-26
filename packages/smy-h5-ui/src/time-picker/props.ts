import { PropType } from 'vue'
import { assign } from '../_utils/shared'
import { PickerBaseColumnItem, pickerSharedProps } from '../picker/props'
import { ExtractPropTypes, createArrayProp, createNumericProp } from '../_utils/vue/props'

export const TIME_PICKER_COLUMN_TYPE = ['hour', 'minute', 'second'] as const

export type TimePickerColumnType = (typeof TIME_PICKER_COLUMN_TYPE)[number]

export type TimePickerColumnItem = PickerBaseColumnItem & { type: TimePickerColumnType }

const validateTime = (val: string) => /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(val)

export const props = assign(
  {
    value: createArrayProp<string>(),
    columnsType: { type: Array as PropType<TimePickerColumnType[]>, default: () => TIME_PICKER_COLUMN_TYPE },
    minHour: createNumericProp(0),
    maxHour: createNumericProp(23),
    minMinute: createNumericProp(0),
    maxMinute: createNumericProp(59),
    minSecond: createNumericProp(0),
    maxSecond: createNumericProp(59),
    minTime: {
      type: String,
      validator: validateTime,
    },
    maxTime: {
      type: String,
      validator: validateTime,
    },
    formatter: {
      type: Function as PropType<(item: TimePickerColumnItem) => TimePickerColumnItem>,
      default: (item: TimePickerColumnItem) => item,
    },
    filter: Function as PropType<(item: TimePickerColumnItem) => boolean>,
  },
  pickerSharedProps
)

export type TimePickerProps = ExtractPropTypes<typeof props>
