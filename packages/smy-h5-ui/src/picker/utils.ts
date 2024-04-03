import Vue from 'vue'
import { Numeric, isNil, IN_BROWSER, range, assign } from '@smy-h5/shared'
import { isSameValue } from '../_utils/shared'
import { SmyComponent } from '../_utils/smy/component'
import { MountedInstance, mountComponent } from '../_utils/vue/component'
import { createNamespace } from '../_utils/vue/create'
import { DisabledFormatter, PickerColumnItem, ScrollColumn } from './props'
import { PopupEmit, PopupListeners, popupListenerKeys } from '../popup/shared'
import { ScopedSlotReturnValue } from 'vue/types/vnode'

// @ts-ignore
const functionRenderContextPrototype = Vue.FunctionalRenderContext.prototype

export const looseEqual: (a: any, b: any) => boolean = functionRenderContextPrototype._q || isSameValue

const [name, bem] = createNamespace('picker')

export { name, bem }

export const pickerToolbarSlots = ['cancel', 'confirm', 'title', 'toolbar'] as const

export const pickerPopupListeners = popupListenerKeys

export const pickerSharedListeners = [...pickerPopupListeners, 'confirm', 'cancel', 'change', 'update:value'] as const

export function findIndexFromColumn(index: number, scrollColumn: ScrollColumn, getDisabled: DisabledFormatter) {
  const { column } = scrollColumn
  index = range(index, 0, column.length - 1)
  for (let i = index; i < column.length; i++) {
    if (!getDisabled(column[i], scrollColumn)) {
      return i
    }
  }
  for (let i = index - 1; i >= 0; i--) {
    if (!getDisabled(column[i], scrollColumn)) {
      return i
    }
  }
  return 0
}

export type PickedValues = Numeric[]

export type PickerResolvedState = 'confirm' | 'close' | 'cancel'

export type PickerResult = {
  state: PickerResolvedState
} & Partial<PickedData>

type PickedData = {
  values: PickedValues
  indexes: number[]
}

export type PickerEmit = {
  (event: 'confirm', data: PickedData): void
  (event: 'cancel', data: PickedData): void
  (event: 'change', data: PickedData): void
} & PopupEmit

export type PickerSharedListeners = {
  onChange?: (data: PickedData) => void
  onConfirm?: (data: PickedData) => void
  onCancel?: (data: PickedData) => void
} & PopupListeners

export type PickerScopedSlots = {
  toolbar: () => ScopedSlotReturnValue
  cancel: () => ScopedSlotReturnValue
  title: () => ScopedSlotReturnValue
  confirm: () => ScopedSlotReturnValue
  top: () => ScopedSlotReturnValue
  item: (data: { item: PickerColumnItem; index: number }) => ScopedSlotReturnValue
}

export function createPicker<
  PickerComponent extends SmyComponent,
  Options,
  NormaliedOptions extends PickerSharedListeners,
>(picker: PickerComponent, genOptions: (options: Options) => NormaliedOptions) {
  let singletonInstance: MountedInstance<NormaliedOptions & { show: boolean }> | null

  const Picker = function Picker(options: Options): Promise<PickerResult | void> {
    if (!IN_BROWSER) {
      return Promise.resolve()
    }
    return new Promise((resolve) => {
      Picker.close()
      const pickerOptions = genOptions(options)

      const { instance, unmount } = mountComponent<NormaliedOptions & { show: boolean }>(picker as any, 'body', {
        propsData: pickerOptions,
      })
      instance.show = true

      singletonInstance = instance
      const clearSingletonInstance = () => singletonInstance === instance && (singletonInstance = null)
      instance.$on('click-overlay', () => pickerOptions.onClickOverlay?.())
      instance.$on('open', () => pickerOptions.onOpen?.())
      instance.$on('opened', () => pickerOptions.onOpened?.())
      instance.$on('close', () => {
        pickerOptions.onClose?.()
        resolve({ state: 'close' })
        clearSingletonInstance()
      })
      instance.$on('closed', () => {
        pickerOptions.onClosed?.()
        unmount()
        clearSingletonInstance()
      })
      instance.$on('change', (data: PickedData) => {
        pickerOptions.onChange?.(data)
        clearSingletonInstance()
      })
      instance.$on('confirm', (data: PickedData) => {
        pickerOptions.onConfirm?.(data)
        resolve(assign({ state: 'confirm' } as const, data))
        instance.show = false
        clearSingletonInstance()
      })
      instance.$on('cancel', (data: PickedData) => {
        pickerOptions.onCancel?.(data)
        resolve(assign({ state: 'cancel' } as const, data))
        instance.show = false
        clearSingletonInstance()
      })
      instance.$on('update:show', (value: boolean) => {
        instance.show = value
      })
      instance.$on('route-change', () => {
        unmount()
        clearSingletonInstance()
      })
      instance.show = true
    })
  }

  Picker.close = () => {
    if (isNil(singletonInstance)) return
    const preSingletonInstance: any = singletonInstance
    singletonInstance = null
    return Vue.nextTick().then(() => {
      preSingletonInstance.show = false
    })
  }

  Picker.Component = picker
  Picker.install = picker.install
  return Picker
}
