import type { PropType } from 'vue'
import { ExtractPropTypes, createArrayProp, createNumericProp, createStringProp, truthProp } from '../_utils/vue/props'
import { type Numeric, assign, keys } from '@smy-h5/shared'
import { popupSharedProps } from '../popup/shared'

export type PickerBaseColumnItem = {
  text?: Numeric
  value?: Numeric
  children?: PickerColumn
  disabled?: boolean
  [key: PropertyKey]: any
}

export type PickerColumnItem = string | PickerBaseColumnItem

export type PickerColumn = PickerColumnItem[]

export type DisabledFormatter = (item: PickerColumnItem, scrollColumn: ScrollColumn) => boolean

export type ChildrenFormatter = (item: PickerColumnItem, scrollColumn: ScrollColumn) => PickerColumnItem[]

export type TextFormatter = (item: PickerColumnItem, scrollColumn: ScrollColumn) => string

export type ValueFormatter = (item: PickerColumnItem, scrollColumn: ScrollColumn) => Numeric

export interface ScrollColumn {
  id: number
  column: PickerColumn
  columnIndex: number
  pickedIndex: number
  columns: PickerColumn[]
}

export const pickerToolbarProps = {
  title: String,
  confirmButtonText: createStringProp('确认'),
  cancelButtonText: createStringProp('取消'),
}

export const pickerToolbarPropKeys = keys(pickerToolbarProps)

export const pickerSharedProps = assign(
  {
    toolbar: truthProp,
    popup: truthProp,
    allowHtml: Boolean,
    optionHeight: createNumericProp(44),
    optionCount: createNumericProp(6),
  },
  pickerToolbarProps,
  popupSharedProps,
)

export const pickerSharedPropKeys = keys(pickerSharedProps)

export const props = assign(
  {
    value: Array,
    cascade: Boolean,
    columns: createArrayProp<PickerColumn>(),
    itemText: {
      type: [String, Function] as PropType<TextFormatter | string>,
      default: 'text',
    },
    itemValue: {
      type: [String, Function] as PropType<ValueFormatter | string>,
      default: 'value',
    },
    itemChildren: {
      type: [String, Function] as PropType<ChildrenFormatter | string>,
      default: 'children',
    },
    itemDisabled: {
      type: [String, Function] as PropType<DisabledFormatter | string>,
      default: 'disabled',
    },
    presetValue: Function as PropType<(scrollColumn: ScrollColumn) => string>,
  },
  pickerSharedProps,
)

export type PickerProps = ExtractPropTypes<typeof props>
