import { pick } from '../_utils/shared'
import { props as popupProps } from '../popup/props'
import type { PropType } from 'vue'
import type { ExtractPropTypes } from '../_utils/vue/props'

export type Text = any

export type Texts = Text[]

export interface NormalColumn {
  texts: Texts
  initialIndex?: number
}

export const props = {
  title: String,
  columns: {
    type: Array as PropType<NormalColumn[] | Texts>,
    default: () => [],
  },
  textKey: {
    type: String,
    default: 'text',
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
  textFormatter: {
    type: Function as PropType<(text: any, columnIndex: number) => any>,
    default: (text: any) => text,
  },
  rotate: {
    type: [Number],
    default: 20,
  },
  ...pick(popupProps, ['show', 'closeOnClickOverlay', 'teleport']),
}

export type PickerProps = ExtractPropTypes<typeof props>
