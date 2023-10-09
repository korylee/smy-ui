import type Vue from 'vue'

const methods = {
  hasSlot(this: Vue, name = 'default') {
    const { $scopedSlots, $slots } = this as unknown as Vue
    return Boolean($scopedSlots[name] || $slots[name])
  },
  getSlot(this: Vue, name = 'default', data: any) {
    const { $scopedSlots, $slots } = this as unknown as Vue
    const scopedSlots = $scopedSlots[name]
    return scopedSlots ? scopedSlots(data) : $slots[name]
  },
}

export const hasSlot = (...args: [Vue, string | undefined]) => methods.hasSlot.call(...args)

export const getSlot = (...args: [Vue, string | undefined, any]) => methods.getSlot.call(...args)

export const SlotsMixin = {
  methods,
}
