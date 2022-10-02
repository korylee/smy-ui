export const hasSlots = (vm: any, name = 'default') => vm.$scopedSlots[name] || vm.$slots[name]

export function getSlots(vm: any, name = 'default', data?: Record<string, any>) {
  const { $slots, $scopedSlots } = vm
  const scopedSlots = $scopedSlots[name]
  return scopedSlots ? scopedSlots(data) : $slots[name]
}

export const SlotsMixin = {
  methods: {
    hasSlots(name: string) {
      return hasSlots(this, name)
    },
    getSlots(name?: string, data?: Record<string, any>) {
      return getSlots(this, name, data)
    },
  },
} as const
