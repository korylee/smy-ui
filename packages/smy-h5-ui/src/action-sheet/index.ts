import Vue, { VNode } from 'vue'
import { RequiredPartial, assign } from '../_utils/shared'
import { SmyComponent } from '../_utils/smy/component'
import { MountedInstance, mountComponent, withInstall } from '../_utils/vue/component'
import _ActionSheet from './ActionSheet'
import { ActionSheetItem, ActionSheetProps } from './props'
import { IN_BROWSER } from '../_utils/env'
import { isArray } from '../_utils/is'
import { PopupListeners } from '../popup/shared'

declare interface SmyActionSheet extends SmyComponent {
  new (): {
    $props: ActionSheetProps
    $emit: {
      (event: 'select', item: ActionSheetItem, index: number): void
      (event: 'cancel'): void
    }
    $scopedSlots: {
      default: () => VNode
      item: (data: { item: ActionSheetItem; index: number }) => VNode
      desc: () => VNode
      cancel: () => VNode
    }
  }
}

const _SmyActionSheet = withInstall(_ActionSheet) as SmyActionSheet

export type ActionSheetListeners = {
  onSelect?: (action: ActionSheetItem, index: number) => void
} & PopupListeners

export type ActionSheetOptions = Omit<ActionSheetProps, 'teleport'> & ActionSheetListeners

export type ActionSheetResult = ActionSheetItem | 'close'

let singletonInstance: MountedInstance<ActionSheetProps> | null
let defaultOptions: ActionSheetOptions = {}

function normalizeOptions(options: ActionSheetOptions | ActionSheetItem[]) {
  const opt = isArray(options) ? { items: options } : options
  return assign({}, defaultOptions, opt)
}

const ActionSheet = function ActionSheet(
  options: RequiredPartial<ActionSheetOptions, 'items'> | ActionSheetItem[],
): Promise<ActionSheetResult | void> {
  if (!IN_BROWSER) {
    return Promise.resolve()
  }
  return new Promise((resolve) => {
    ActionSheet.close()
    const actionSheetOptions = normalizeOptions(options)

    const { unmount, instance } = mountComponent<ActionSheetProps>(_SmyActionSheet, 'body', {
      propsData: actionSheetOptions,
    })
    singletonInstance = instance
    const clearSingletonInstance = () => singletonInstance === instance && (singletonInstance = null)
    instance.$on('select', (action: ActionSheetItem, index: number) => {
      actionSheetOptions.onSelect?.(action, index)
      resolve(action)
    })
    instance.$on('close', () => {
      actionSheetOptions.onClose?.()
      resolve('close')
    })
    instance.$on('closed', () => {
      actionSheetOptions.onClosed?.()
      unmount()
      clearSingletonInstance()
    })
    instance.$on('open', () => actionSheetOptions.onOpen?.())
    instance.$on('opened', () => actionSheetOptions.onOpened?.())
    instance.$on('click-overlay', () => actionSheetOptions.onClickOverlay?.())
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

ActionSheet.setDefaultOptions = function (options: ActionSheetOptions) {
  defaultOptions = options
}

ActionSheet.resetDefaultOptions = function () {
  defaultOptions = {}
}

ActionSheet.close = function () {
  if (singletonInstance != null) {
    const prevSingletonInssingletonInstance = singletonInstance
    singletonInstance = null
    Vue.nextTick().then(() => {
      prevSingletonInssingletonInstance.show = false
    })
  }
}

ActionSheet.Component = _SmyActionSheet

ActionSheet.install = _SmyActionSheet.install

export default ActionSheet
