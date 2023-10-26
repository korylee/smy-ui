import type Vue from 'vue'

function _hasSlot(this: Vue, name = 'default') {
  const { $scopedSlots, $slots } = this
  return Boolean($scopedSlots[name] || $slots[name])
}
function _getSlot(this: Vue, name = 'default', data?: any) {
  const { $scopedSlots, $slots } = this
  const scopedSlots = $scopedSlots[name]
  return scopedSlots ? scopedSlots(data) : $slots[name]
}
const methods = {
  hasSlot: _hasSlot,
  getSlot: _getSlot,
}

export const hasSlot = (...args: [Vue, ...Parameters<typeof _hasSlot>]) => _hasSlot.call(...args)

export const getSlot = (...args: [Vue, ...Parameters<typeof _getSlot>]) => _getSlot.call(...args)

export const SlotsMixin = {
  methods,
}
