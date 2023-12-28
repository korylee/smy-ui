import { VNode } from 'vue'
import { isArray } from '../_utils/is'
import { SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import { PickedValues, PickerSharedListeners, createPicker } from '../picker/utils'
import _TimePicker from './TimePicker'
import { TimePickerColumnType, TimePickerProps } from './props'
import { RequiredPartial } from '../_utils/shared'

export declare class SmyTimePicker extends SmyComponent {
  new(): {
    $props: TimePickerProps
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

const _SmyTimePicker = withInstall(_TimePicker)

type TimePickerOptions = RequiredPartial<Omit<TimePickerProps, 'popup'>, 'columnsType'> & PickerSharedListeners

const nomalizeOptions = (options: TimePickerOptions | TimePickerColumnType[]): TimePickerOptions =>
  isArray(options) ? { columnsType: options } : options

const TimePicker = createPicker(_SmyTimePicker, nomalizeOptions)

export default TimePicker
