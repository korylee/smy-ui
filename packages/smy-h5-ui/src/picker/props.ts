import { assign, pick } from '../_utils/shared'
import { props as popupProps } from '../popup/props'
import type { PropType } from 'vue'
import { ExtractPropTypes, createNumberProp, createNumericProp, createStringProp, truthProp } from '../_utils/vue/props'

export type NormalColumnItem = string | any

export type NormalColumn = NormalColumnItem[]

export type CascadeColumn = {
  [key: string]: any
}

const baseProps = {
  modelValue: Array,
  title: String,
  cascade: Boolean,
  columns: {
    type: Array as PropType<NormalColumn[] | CascadeColumn[]>,
    default: () => [],
  },
  optionHeight: createNumericProp(44),
  optionCount: createNumericProp(6),
  confirmButtonText: createStringProp('确认'),
  cancelButtonText: createStringProp('取消'),
  // confirmButtonTextColor: createStringProp(''),
  // cancelButtonTextColor: createStringProp(''),
  toolbar: truthProp,
  rotate: createNumberProp(20),
  popup: truthProp,
  textFormatter: {
    type: [String, Function] as PropType<
      (option: NormalColumnItem | CascadeColumn, columnIndex: number) => any | string
    >,
    default: 'text',
  },
  valueFormatter: {
    type: [String, Function] as PropType<
      (option: NormalColumnItem | CascadeColumn, columnIndex: number) => any | string
    >,
    default: 'value',
  },
  childrenFormatter: {
    type: [String, Function] as PropType<(option: CascadeColumn, columnIndex: number) => CascadeColumn[] | undefined>,
    default: 'children',
  },
  allowHtml: Boolean,
}

export const props = assign(baseProps, pick(popupProps, ['show', 'closeOnClickOverlay', 'teleport']))

export type PickerProps = ExtractPropTypes<typeof props>
