import Vue from 'vue'

export function hasSlot(this: Vue, name = 'default') {
  const { $scopedSlots, $slots } = this
  return Boolean($scopedSlots[name] || $slots[name])
}

const methods = {
  hasSlot: hasSlot,
}

export const SlotsMixin = {
  methods,
}
