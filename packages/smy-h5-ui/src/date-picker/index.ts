import { VNode } from 'vue'
import { isArray } from '../_utils/is'
import { SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import { PartialRequired, PickedValues, PickerSharedListeners, createPicker } from '../picker/utils'
import _DatePicker from './DatePicker.jsx'
import { DatePickerColumnType, DatePickerProps } from './props'

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
      (event: 'open'): void
      (event: 'opened'): void
      (event: 'close'): void
      (event: 'closed'): void
      (event: 'route-change'): void
      (event: 'click-overlay'): void
      (event: 'confirm', values: PickedValues, indexes: number[]): void
      (event: 'cancel', values: PickedValues, indexes: number[]): void
      (event: 'change', values: PickedValues, indexes: number[]): void
    }
  }
}

const _SmyDatePicker = withInstall(_DatePicker)

type DatePickerOptions = PartialRequired<Omit<DatePickerProps, 'popup'>, 'columnsType'> & PickerSharedListeners

const nomalizeOptions = (options: DatePickerOptions | DatePickerColumnType[]): DatePickerOptions =>
  isArray(options) ? { columnsType: options } : options

const DatePicker = createPicker(_SmyDatePicker, nomalizeOptions)

export default DatePicker
