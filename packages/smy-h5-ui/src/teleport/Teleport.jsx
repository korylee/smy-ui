import { getSlot } from '../_utils/vue/slots'
import Vue from 'vue'
import { props } from './props'
import { createNamespace } from '../_utils/vue/create'
import { getElement } from '../_utils/dom'

const [name, bem] = createNamespace('teleport')

export default {
  name,
  props,
  data: () => ({
    el: null,
    instance: null,
  }),
  watch: {
    disabled: 'transfer',
    to: 'transfer',
  },
  updated() {
    this.instance.$forceUpdate()
  },
  mounted() {
    this.create()
    this.transfer()
  },
  deactivated() {
    this.el.parentNode?.removeChild(this.el)
  },
  activated() {
    this.transfer()
  },
  beforeDestroy() {
    this.instance.$destroy()
    this.el.parentNode?.removeChild(this.el)
  },
  methods: {
    create() {
      const Ctor = Vue.extend({
        render: () => <div class={bem('container')}>{getSlot(this)}</div>,
      })
      const instance = new Ctor()
      instance.$parent = this
      this.el = instance.$mount().$el
      this.instance = instance
    },
    transfer() {
      const { el, disabled, to } = this
      const { teleport } = this.$refs
      const container = disabled ? teleport : getElement(to)
      const parentNode = el.parentNode
      if (parentNode === container) return
      parentNode?.removeChild(el)
      container.appendChild(el)
    },
  },
  render() {
    return <div ref="teleport" class={bem()} />
  },
}
