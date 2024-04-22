import Vue from 'vue'
import { props } from './props'
import { createNamespace } from '../_utils/vue/create'
import { getElement } from '@smy-h5/shared'
import { onMountedOrActivated } from '../_utils/vue/lifetime'

const [name, bem] = createNamespace('teleport')

const InternalTeleport = {
  name,
  props,
  mounted() {
    const Ctor = Vue.extend({
      render: () => <div class={bem('container')}>{this._t('default')}</div>,
    })
    const instance = new Ctor()
    instance.$parent = this
    const el = instance.$mount().$el

    const transfer = () => {
      const { disabled, to } = this
      const { teleport } = this.$refs
      const container = disabled ? teleport : getElement(to)
      const parentNode = el.parentNode
      if (parentNode === container) return
      parentNode?.removeChild(el)
      container.appendChild(el)
    }
    this.$watch(() => [this.disabled, this.to], transfer)
    onMountedOrActivated(this, transfer)
    this.$once('hook:beforeDestroy', () => {
      instance.$destroy()
      el.parentNode?.removeChild(el)
    })
    this.$on('hook:deactivated', () => {
      el.parentNode?.removeChild(el)
    })
    this.$on('hook:updated', () => {
      instance.$forceUpdate()
    })
  },
  render() {
    return <div ref="teleport" class={bem()} />
  },
}

export default {
  name,
  functional: true,
  props,
  render(c, { props, listeners, children }) {
    if (!props.to) {
      return children
    }
    return c(InternalTeleport, { on: listeners, props: props }, children)
  },
}
