import Vue from 'vue'

const renderSlot = Vue.prototype._t
export function hasSlot(this: Vue, name = 'default') {
  const { $scopedSlots, $slots } = this
  return Boolean($scopedSlots[name] || $slots[name])
}
export function getSlot(this: Vue, name = 'default', data?: any) {
  return renderSlot.call(this, name, undefined, data)
}

const methods = {
  hasSlot: hasSlot,
  getSlot: getSlot,
}

export const SlotsMixin = {
  methods,
}
