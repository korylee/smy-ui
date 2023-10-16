import type Vue from 'vue'
// import { assign, keys } from '../shared'

function _hasSlot(this: Vue, name = 'default') {
  const { $scopedSlots, $slots } = this
  return Boolean($scopedSlots[name] || $slots[name])
}
function _getSlot(this: Vue, name = 'default', data: any) {
  const { $scopedSlots, $slots } = this
  const scopedSlots = $scopedSlots[name]
  return scopedSlots ? scopedSlots(data) : $slots[name]
}
const methods = {
  hasSlot: _hasSlot,
  getSlot: _getSlot,
  // getSlots(this: Vue) {
  //   const { $scopedSlots, $slots } = this
  //   const slots = assign({}, $scopedSlots)

  //   return keys($slots).reduce((prev, curr) => {
  //     prev[curr] = prev[curr] ?? (() => $slots[curr])
  //     return prev
  //   }, slots)
  // },
}

export const hasSlot = (...args: [Vue, string | undefined]) => _hasSlot.call(...args)

export const getSlot = (...args: [Vue, string | undefined, any]) => _getSlot.call(...args)

export const SlotsMixin = {
  methods,
}
