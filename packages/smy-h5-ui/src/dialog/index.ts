import Vue from 'vue'
import { assign } from '../_utils/shared'
import { SmyComponent } from '../_utils/smy/component'
import { MountedInstance, mountComponent, withInstall } from '../_utils/vue/component'
import _Dialog from './Dialog'
import { DialogProps } from './props'
import { IN_BROWSER } from '../_utils/env'
import { PopupEmit, PopupListeners } from '../popup/shared'
import { ScopedSlotReturnValue } from 'vue/types/vnode'

declare interface SmyDialog extends SmyComponent {
  new (): {
    $props: DialogProps
    $emit: {
      (event: 'confirm'): void
      (event: 'cancel'): void
    } & PopupEmit
    $scopedSlots: {
      default: () => ScopedSlotReturnValue
      title: () => ScopedSlotReturnValue
    }
  }
}

const _SmyDialog = withInstall(_Dialog) as SmyDialog

export type DialogListeners = {
  onConfirm?: () => void
  onCancel?: () => void
} & PopupListeners

export type DialogOptions = Omit<DialogProps, 'teleport'> & DialogListeners

let singletonInstance: MountedInstance<DialogProps> | null
let defaultOptions: DialogOptions = {}

function normalizeOptions(options: DialogOptions) {
  return assign({}, defaultOptions, options)
}

type DialogResult = 'confirm' | 'cancel'

const Dialog = function Dialog(options: DialogOptions): Promise<DialogResult | void> {
  if (!IN_BROWSER) {
    return Promise.resolve()
  }
  return new Promise((resolve) => {
    Dialog.close()
    const dialogOptions = normalizeOptions(options)

    const { unmount, instance } = mountComponent<DialogProps>(_SmyDialog, 'body', {
      propsData: dialogOptions,
    })

    singletonInstance = instance
    const clearSingletonInstance = () => singletonInstance === instance && (singletonInstance = null)

    instance.$on('confirm', () => {
      resolve('confirm')
      dialogOptions.onConfirm?.()
    })
    instance.$on('cancel', () => {
      resolve('cancel')
      dialogOptions.onCancel?.()
    })
    instance.$on('close', () => {
      dialogOptions.onClose?.()
    })
    instance.$on('closed', () => {
      dialogOptions.onClosed?.()
      unmount()
      clearSingletonInstance()
    })
    instance.$on('open', () => dialogOptions.onOpen?.())
    instance.$on('opened', () => dialogOptions.onOpened?.())
    instance.$on('click-overlay', () => dialogOptions.onClickOverlay?.())
    instance.$on('route-change', () => {
      unmount()
      clearSingletonInstance()
    })
    instance.$on('update:show', (val: boolean) => {
      instance.show = val
    })

    instance.show = true
  })
}

Dialog.setDefaultOptions = function (options: DialogOptions) {
  defaultOptions = options
}

Dialog.resetDefaultOptions = function () {
  defaultOptions = {}
}

Dialog.close = function () {
  if (singletonInstance != null) {
    const prevSingletonInssingletonInstance = singletonInstance
    singletonInstance = null
    Vue.nextTick().then(() => {
      prevSingletonInssingletonInstance.show = false
    })
  }
}

Dialog.Component = _SmyDialog

Dialog.install = _SmyDialog.install

export default Dialog
