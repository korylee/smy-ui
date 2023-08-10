import { WatchSource, ref, watch } from 'vue'

export function useInitialized(source: WatchSource<boolean | undefined>) {
  const initialized = ref(false)

  watch(
    source,
    (val) => {
      if (val) {
        initialized.value = true
      }
    },
    { immediate: true }
  )

  return initialized
}
