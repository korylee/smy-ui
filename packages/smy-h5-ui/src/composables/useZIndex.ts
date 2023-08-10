import { ref, watch } from 'vue'

let currentZIndex = 200

export function useZIndex(source: () => boolean, count: number) {
  const zIndex = ref(currentZIndex)
  watch(
    source,
    (newValue) => {
      if (!newValue) return
      currentZIndex += count
      zIndex.value = currentZIndex
    },
    { immediate: true }
  )
  return zIndex
}
