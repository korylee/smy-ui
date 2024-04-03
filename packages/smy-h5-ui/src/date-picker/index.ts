import { VNode } from 'vue'
import { isArray, RequiredPartial } from '@smy-h5/shared'
import { SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import { PickedValues, PickerSharedListeners, createPicker } from '../picker/utils'
import _DatePicker from './DatePicker.jsx'
import { DatePickerColumnType, DatePickerProps } from './props'
import { PopupEmit } from '../popup/shared'

export declare class SmyDatePicker extends SmyComponent {
  new(): {
    $props: DatePickerProps
    $scopedSlots: {
      toolbar: () => VNode
      cancel: () => VNode
      title: () => VNode
      confirm: () => VNode
      top: () => VNode
    }
    $emit: {
      (event: 'confirm', values: PickedValues, indexes: number[]): void
      (event: 'cancel', values: PickedValues, indexes: number[]): void
      (event: 'change', values: PickedValues, indexes: number[]): void
    } & PopupEmit
  }
}

const _SmyDatePicker = withInstall(_DatePicker)

type DatePickerOptions = RequiredPartial<Omit<DatePickerProps, 'popup'>, 'columnsType'> & PickerSharedListeners

const nomalizeOptions = (options: DatePickerOptions | DatePickerColumnType[]): DatePickerOptions =>
  isArray(options) ? { columnsType: options } : options

const DatePicker = createPicker(_SmyDatePicker, nomalizeOptions)

export default DatePicker
