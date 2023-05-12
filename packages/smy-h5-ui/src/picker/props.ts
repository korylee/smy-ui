import { assign, pick } from '../_utils/shared'
import { props as popupProps } from '../popup/props'
import type { PropType } from 'vue'
import type { ExtractPropTypes } from '../_utils/vue/props'

export type ColumnItem = string | any

export type Column = ColumnItem[]

const baseProps = {
  value: Array,
  title: String,
  cascade: Boolean,
  columns: {
    type: Array as PropType<Column[]>,
    default: () => [],
  },
  optionHeight: {
    type: [Number, String],
    default: 44,
  },
  optionCount: {
    type: [Number, String],
    default: 6,
  },
  confirmButtonText: {
    type: String,
    default: '确认',
  },
  cancelButtonText: {
    type: String,
    default: '取消',
  },
  confirmButtonTextColor: {
    type: String,
    default: '',
  },
  cancelButtonTextColor: {
    type: String,
    default: '',
  },
  toolbar: {
    type: Boolean,
    default: true,
  },
  rotate: {
    type: [Number],
    default: 20,
  },
  popup: {
    type: Boolean,
    default: true,
  },
  textFormatter: {
    type: [String, Function] as PropType<(item: ColumnItem, columnIndex: number) => any | string>,
    default: 'text',
  },
  valueFormatter: {
    type: [String, Function] as PropType<(item: ColumnItem, columnIndex: number) => any | string>,
    default: 'value',
  },
  childrenFormatter: {
    type: [String, Function] as PropType<(item: ColumnItem, columnIndex: number) => ColumnItem[]>,
    default: 'children',
  },
}

export const props = assign(baseProps, pick(popupProps, ['show', 'closeOnClickOverlay', 'teleport']))

export type PickerProps = ExtractPropTypes<typeof props>
