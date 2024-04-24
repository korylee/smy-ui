import { computed, getCurrentInstance, inject, onUnmounted, ref } from 'vue'

export function useParent(key: string | symbol) {
  const parent: any = inject(key, null)

  if (parent) {
    const instance = getCurrentInstance()!.proxy!

    const { link, unlink, children } = parent
    link(instance)
    onUnmounted(() => unlink(instance))
    const index = computed(() => children.indexOf(instance))
    return {
      parent,
      index,
    }
  }
  return {
    parent: null,
    index: ref(-1),
  }
}
