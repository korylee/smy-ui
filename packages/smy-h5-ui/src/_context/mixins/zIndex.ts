import context from '../index'

export const createZIndexMixin = (state: string, count = 1) => ({
  computed: {
    zIndex: () => context.zIndex,
  },
  watch: {
    [state]: {
      immediate: true,
      handler(newValue: any) {
        if (!newValue) return
        context.zIndex += count
      },
    },
  },
})
