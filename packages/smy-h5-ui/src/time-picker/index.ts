import { VNode } from 'vue'
import { isArray, type RequiredPartial } from '@smy-h5/shared'
import { SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import { PickerEmit, PickerSharedListeners, createPicker } from '../picker/utils'
import _TimePicker from './TimePicker'
import { TimePickerColumnType, TimePickerProps } from './props'

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
    $emit: PickerEmit
  }
}

const _SmyTimePicker = withInstall(_TimePicker) as SmyTimePicker

type TimePickerOptions = RequiredPartial<Omit<TimePickerProps, 'popup'>, 'columnsType'> & PickerSharedListeners

const nomalizeOptions = (options: TimePickerOptions | TimePickerColumnType[]): TimePickerOptions =>
  isArray(options) ? { columnsType: options } : options

const TimePicker = createPicker(_SmyTimePicker, nomalizeOptions)

export default TimePicker
