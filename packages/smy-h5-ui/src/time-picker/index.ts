import { VNode } from 'vue'
import { isArray } from '../_utils/is'
import { SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import { PickerEmit, PickerSharedListeners, createPicker } from '../picker/utils'
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
    $emit: PickerEmit
  }
}

const _SmyTimePicker = withInstall(_TimePicker)

type TimePickerOptions = RequiredPartial<Omit<TimePickerProps, 'popup'>, 'columnsType'> & PickerSharedListeners

const nomalizeOptions = (options: TimePickerOptions | TimePickerColumnType[]): TimePickerOptions =>
  isArray(options) ? { columnsType: options } : options

const TimePicker = createPicker(_SmyTimePicker, nomalizeOptions)

export default TimePicker
