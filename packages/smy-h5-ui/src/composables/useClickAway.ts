import { Ref, unref } from 'vue'
import { IN_BROWSER } from '../_utils/env'
import { useEventListener } from './useEventListener'
import { wrapInArray } from '../_utils/shared'

type UseClickAwayOptions = { eventName?: keyof DocumentEventMap }

export function useClickAway(
  target: Element | Ref<Element | undefined> | Array<Element | Ref<Element | undefined>>,
  listener: EventListener,
  options: UseClickAwayOptions = {}
) {
  if (!IN_BROWSER) return
  const { eventName = 'click' } = options
  function onClick(event: Event) {
    const targets = wrapInArray(target)
    const isClickAway = targets.every((item) => {
      const ele = unref(item)
      return ele && !ele.contains(event.target as Node)
    })
    if (isClickAway) {
      listener(event)
    }
  }
  useEventListener(eventName, onClick, { target: document })
}
