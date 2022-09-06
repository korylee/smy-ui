export function hasSlots(vm: any, name = 'default') {
  return vm.$scopedSlots[name] || vm.$slots[name]
}

export function getSlots(vm: any, name = 'default', props: Record<string, any>) {
  const { $slots, $scopedSlots } = vm
  const scopedSlots = $scopedSlots[name]
  return scopedSlots ? scopedSlots(props) : $slots[name]
}
