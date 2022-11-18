import { pick } from '../_utils/shared'
import { props as popupProps } from '../popup/props'
import type { PropType } from 'vue'
import type { ExtractPropTypes } from '@smy-h5/vtools'

export type Texts = any[]

export interface NormalColumn {
  texts: Texts
  initialIndex?: number
}

export const props = {
  title: String,
  // dynamic: Boolean,
  columns: {
    type: Array as PropType<NormalColumn[] | Texts[]>,
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
  },
  cancelButtonTextColor: {
    type: String,
  },
  toolbar: {
    type: Boolean,
    default: true,
  },
  textFormatter: {
    type: Function as PropType<(tezt: any, columnIndex: number) => any>,
    default: (text: any) => text,
  },
  ...pick(popupProps, ['show', 'closeOnClickOverlay', 'teleport']),
}

export type PickerProps = ExtractPropTypes<typeof props>
