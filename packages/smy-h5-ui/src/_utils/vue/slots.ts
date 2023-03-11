export const hasSlot = (vm: any, name = 'default') => Boolean(vm.$scopedSlots[name] || vm.$slots[name])

export function getSlot(vm: any, name = 'default', data?: Record<string, any>) {
  const { $slots, $scopedSlots } = vm
  const scopedSlots = $scopedSlots[name]
  return scopedSlots ? scopedSlots(data) : $slots[name]
}

export const SlotsMixin = {
  methods: {
    hasSlot(name?: string) {
      return hasSlot(this, name)
    },
    getSlot(name?: string, data?: Record<string, any>) {
      return getSlot(this, name, data)
    },
  },
} as const
