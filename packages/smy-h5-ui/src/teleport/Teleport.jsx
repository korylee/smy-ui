import { getSlot } from '../_utils/vue/slots'
import Vue from 'vue'
import { props } from './props'

export default {
  name: 'SmyTeleport',
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
        render: () => <div class="smy-teleport__container">{getSlot(this)}</div>,
      })
      this.instance = new Ctor()
      this.instance.$parent = this
      this.el = this.instance.$mount().$el
    },
    transfer() {
      const { el, disabled } = this
      const container = disabled ? this.$refs.teleport : document.querySelector(this.to)
      const parentNode = el.parentNode
      if (parentNode === container) return
      parentNode?.removeChild(el)
      container.appendChild(el)
    },
  },
  render() {
    return <div ref="teleport" class="smy-teleport" />
  },
}
