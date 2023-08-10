import { Ref, onBeforeUnmount, onDeactivated, watch } from 'vue'
import { onMountedOrActivated } from '../_utils/vue/onMountedOrActivated'
import { useTouch } from '../_utils/composable/useTouch'
import { getScrollParent } from '../_utils/dom'
import { isWindow } from '../_utils/is'

const DIRECTION_UP = '01'
const DIRECTION_DOWN = '10'
const LOCK_CLASS = 'smy--lock'

let totalLockCount = 0

export function useLockScroll(rootRef: Ref<HTMLElement | undefined>, shouldLock: () => boolean) {
  const touch = useTouch()
  const doc = document
  const onTouchMove = (event: TouchEvent) => {
    touch.move(event)
    const direction = touch.state.deltaY > 0 ? DIRECTION_DOWN : DIRECTION_UP
    const el = getScrollParent(event.target as HTMLElement, rootRef.value)
    const { scrollHeight, offsetHeight, scrollTop } = isWindow(window) ? doc.documentElement : (el as HTMLElement)
    let status = '11'
    if (scrollTop === 0) {
      status = offsetHeight >= scrollHeight ? '00' : '01'
    } else if (scrollTop + offsetHeight >= scrollHeight) {
      status = '10'
    }

    if (status !== '11' && touch.isVertical() && !(parseInt(status, 2) & parseInt(direction, 2))) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  const lock = () => {
    doc.addEventListener('touchstart', touch.start)
    doc.addEventListener('touchmove', onTouchMove)
    if (!totalLockCount) {
      doc.body.classList.add(LOCK_CLASS)
    }
    totalLockCount++
  }
  const release = () => {
    if (!totalLockCount) return
    doc.removeEventListener('touchstart', touch.start)
    doc.removeEventListener('touchmove', onTouchMove)
    totalLockCount--
    if (!totalLockCount) {
      doc.body.classList.remove(LOCK_CLASS)
    }
  }

  watch(shouldLock, (value) => {
    value ? lock() : release()
  })

  const init = () => shouldLock() && lock()
  const destory = () => shouldLock() && release()
  onMountedOrActivated(init)
  onDeactivated(destory)
  onBeforeUnmount(destory)
}
