export const teleportMixin = {
  data: () => ({ teleportDisabled: false }),
  activated() {
    ;(this as any).teleportDisabled = false
  },
  deactivated() {
    ;(this as any).teleportDisabled = true
  },
}
