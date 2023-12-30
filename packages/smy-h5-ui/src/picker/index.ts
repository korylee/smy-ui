import type { PickerColumn, PickerProps } from './props'
import type { SmyComponent } from '../_utils/smy/component'

import { withInstall } from '../_utils/vue/component'
import _Picker from './Picker.jsx'
import { isArray } from '../_utils/is'
import { PickerEmit, PickerScopedSlots, PickerSharedListeners, createPicker } from './utils'
import { RequiredPartial } from '../_utils/shared'

type PickerOptions = RequiredPartial<Omit<PickerProps, 'popup'>, 'columns'> & PickerSharedListeners

export declare interface SmyPicker extends SmyComponent {
  new (): {
    $props: PickerProps
    $scopedSlots: PickerScopedSlots
    $emit: PickerEmit
  }
}

const _SmyPicker = withInstall(_Picker) as SmyPicker

const nomalizeOptions = (options: PickerOptions | PickerColumn[]): PickerOptions =>
  isArray(options) ? { columns: options } : options

const Picker = createPicker(_SmyPicker, nomalizeOptions)

export default Picker
