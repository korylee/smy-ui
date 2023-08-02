import { Ref, ref, watch } from 'vue'
import { ScrollerElement, getScrollParent } from '../_utils/dom'

export function useScrollParent(el: Ref<HTMLElement | undefined>, root: ScrollerElement = window) {
  const scollParent = ref<ScrollerElement>()

  watch(el, (value) => {
    if (value) {
      scollParent.value = getScrollParent(value, root)
    }
  })
  return scollParent
}
