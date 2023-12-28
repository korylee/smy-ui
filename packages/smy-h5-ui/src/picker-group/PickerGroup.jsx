import { createNamespace } from '../_utils/vue/create'
import Tabs from '../tabs'
import Tab from '../tab'
import { props } from './props'
import { createParentMixin } from '../_mixins/relation'
import { createProxiedModel } from '../_mixins/proxiedModel'
import PickerToolbar from '../picker/PickerToolbar.vue'
import { pickerPopupListeners, pickerToolbarSlots } from '../picker/utils'
import { getListeners } from '../_mixins/listeners'
import SmyPopup from '../popup'
import { assign, pick } from '../_utils/shared'
import { popupSharedPropKeys } from '../popup/shared'
import { PICKER_KEY } from './shared'

const [name, bem] = createNamespace('picker-group')

export default {
  name,
  props,
  mixins: [
    createParentMixin(PICKER_KEY),
    createProxiedModel('activeTab', 'currentTab', { event: 'update:activeTab', passive: false }),
  ],
  components: {
    SmyTab: Tab,
    SmyTabs: Tabs,
    PickerToolbar,
  },
  computed: {
    showNextButton({ currentTab, tabs, nextStepText }) {
      return +currentTab < tabs.length - 1 && nextStepText
    },
  },
  methods: {
    bem,
    onConfirm() {
      if (this.showNextButton) {
        this.currentTab = +this.currentTab + 1
      } else {
        this.$emit(
          'confirm',
          this.children.map((item) => item.confirm())
        )
      }
    },
    onCancel() {
      this.$emit('cancel')
    },
  },
  render(h) {
    /**@type {import('vue').default} */
    const vm = this
    const {
      popup,
      tabs,
      title,
      showNextButton,
      confirmButtonText: _confirmButtonText,
      nextStepText,
      cancelButtonText,
      onConfirm,
      onCancel,
      currentTab,
    } = vm
    const confirmButtonText = showNextButton ? nextStepText : _confirmButtonText
    const childNodes = vm._t('default')

    const renderToolbar = () => {
      const toolbarSlots = vm._u(
        pickerToolbarSlots.map((key) => ({
          key,
          fn: () => [vm._t(key)],
          proxy: true,
        }))
      )
      return h(PickerToolbar, {
        attrs: { title, cancelButtonText, confirmButtonText },
        on: { confirm: onConfirm, cancel: onCancel },
        scopedSlots: toolbarSlots,
      })
    }
    const renderTabs = () => {
      const attrs = {
        active: currentTab,
        shrink: true,
        animated: true,
      }
      const on = { 'update:active': (val) => (vm.currentTab = val) }
      return h(
        Tabs,
        { attrs, on, class: bem('tabs') },
        tabs.map((title, index) => (
          <Tab key={index} title={title} titleClass={bem('tab-title')}>
            {childNodes?.[index]}
          </Tab>
        ))
      )
    }
    const children = [renderToolbar(), renderTabs()]
    if (popup) {
      const attrs = assign(
        {
          contentClass: bem(),
          wrapperClass: bem('popup'),
          'smy-picker-cover': '',
          position: 'bottom',
        },
        pick(vm.$props, popupSharedPropKeys)
      )
      return h(SmyPopup, { attrs, on: getListeners.call(vm, pickerPopupListeners) }, children)
    }

    return <div class={bem()}>{children}</div>
  },
}
