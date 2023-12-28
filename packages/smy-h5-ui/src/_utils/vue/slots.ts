import type Vue from 'vue'

export function hasSlot(this: Vue, name = 'default') {
  const { $scopedSlots, $slots } = this
  return Boolean($scopedSlots[name] || $slots[name])
}
export function getSlot(this: Vue, name = 'default', data?: any) {
  const { $scopedSlots, $slots } = this
  const scopedSlots = $scopedSlots[name]
  return scopedSlots ? scopedSlots(data) : $slots[name]
}

const methods = {
  hasSlot: hasSlot,
  getSlot: getSlot,
}

export const SlotsMixin = {
  methods,
}
