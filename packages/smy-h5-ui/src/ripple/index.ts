import type { VNodeDirective, VueConstructor } from 'vue'
import { IS_SUPPORT_TOUCH, doubleRaf, getRect, assign, isString } from '@smy-h5/shared'
import context from '../_context'
import { createNamespace } from '../_utils/vue/create'

import '../_styles/common.less'
import './ripple.less'

const [, bem] = createNamespace('ripple')

export type RippleOptions =
  | {
      color?: string
      disabled?: boolean
    }
  | string

export type NormalizedOptions = {
  removeRipple: any
  color?: string
  tasker?: number | null
  disabled?: boolean
}

export interface RippleHTMLElement extends HTMLElement {
  _ripple?: NormalizedOptions
}

export interface RippleVNodeDirective extends VNodeDirective {
  value?: RippleOptions
}

const TASK_TIMEOUT = 30

const ANIMATION_DURATION = 250

function setStyles(element: RippleHTMLElement) {
  const { zIndex, position } = getComputedStyle(element)
  const style = element.style
  style.overflow = 'hidden'
  style.overflowX = 'hidden'
  style.overflowY = 'hidden'
  position === 'static' && (style.position = 'relative')
  zIndex === 'auto' && (style.zIndex = '1')
}

function computRippleStyles(el: RippleHTMLElement, event: TouchEvent) {
  const { top, left } = getRect(el)
  const { clientWidth, clientHeight } = el
  const radius = Math.sqrt(clientWidth ** 2 + clientHeight ** 2) / 2
  const size = radius * 2

  const touch = event.touches[0]
  const localX = touch.clientX - left
  const localY = touch.clientY - top

  const centerX = (clientWidth - radius * 2) / 2
  const centerY = (clientHeight - radius * 2) / 2

  const x = localX - radius
  const y = localY - radius
  return {
    size,
    x,
    y,
    centerX,
    centerY,
  }
}

const className = bem()

function createRipple(this: RippleHTMLElement, event: TouchEvent) {
  const _ripple = this._ripple!
  _ripple.removeRipple()
  if (_ripple.disabled || _ripple.tasker || !context.enableRipple) {
    return
  }
  const task = () => {
    _ripple.tasker = null

    const { x, y, centerX, centerY, size } = computRippleStyles(this, event)
    const ripple: RippleHTMLElement = document.createElement('div')
    ripple.classList.add(className)
    const style = ripple.style
    style.opacity = '0'
    style.transform = `translate(${x}px, ${y}px) scale3d(.3, .3, .3)`
    style.width = `${size}px`
    style.height = `${size}px`
    _ripple.color && (style.backgroundColor = _ripple.color)
    ripple.dataset.createdAt = String(performance.now())

    setStyles(this)

    this.appendChild(ripple)

    doubleRaf(() => {
      style.transform = `translate(${centerX}px, ${centerY}px) scale3d(1, 1, 1)`
      style.opacity = 'var(--ripple-opacity)'
    })
  }

  _ripple.tasker = window.setTimeout(task, TASK_TIMEOUT)
}

function removeRipple(this: RippleHTMLElement) {
  const _ripple = this._ripple!
  const task = () => {
    const ripples: NodeListOf<RippleHTMLElement> = this.querySelectorAll('.' + className)
    if (!ripples.length) return

    const lastRipple = ripples[ripples.length - 1]
    const delay = ANIMATION_DURATION + Number(lastRipple.dataset.createdAt) - performance.now()

    setTimeout(() => {
      lastRipple.style.opacity = '0'
      setTimeout(() => lastRipple.parentNode?.removeChild(lastRipple), ANIMATION_DURATION)
    }, delay)
  }
  _ripple.tasker ? setTimeout(task, TASK_TIMEOUT) : task()
}

function forbidRippleTask(this: RippleHTMLElement) {
  if (!IS_SUPPORT_TOUCH || !context.enableRipple) return
  const _ripple = this._ripple!
  _ripple.tasker && clearTimeout(_ripple.tasker)
  _ripple.tasker = null
}

function genOptions(opt?: RippleOptions) {
  if (isString(opt)) {
    return { color: opt } as NormalizedOptions
  }
  return opt
}

function inserted(el: RippleHTMLElement, binding: RippleVNodeDirective) {
  const _removeRipple = removeRipple.bind(el)
  el._ripple = assign({ tasker: null }, genOptions(binding.value), { removeRipple: _removeRipple })
  el.addEventListener('touchstart', createRipple, { passive: true })
  el.addEventListener('touchmove', forbidRippleTask, { passive: true })
  el.addEventListener('dragstart', removeRipple, { passive: true })

  document.addEventListener('touchend', _removeRipple, { passive: true })
  document.addEventListener('touchcancel', _removeRipple, { passive: true })
  document.addEventListener('dragend', _removeRipple, { passive: true })
}
function unbind(el: RippleHTMLElement) {
  const { removeRipple } = el._ripple!
  el.removeEventListener('touchstart', createRipple)
  el.removeEventListener('touchmove', forbidRippleTask)
  el.removeEventListener('dragstart', removeRipple)

  document.removeEventListener('touchend', removeRipple)
  document.removeEventListener('touchcancel', removeRipple)
  document.removeEventListener('dragend', removeRipple)
}

function update(el: RippleHTMLElement, binding: RippleVNodeDirective) {
  const { value } = binding
  const options = genOptions(value)
  const newBinding = { color: options?.color, disabled: options?.disabled }
  const { color, disabled, tasker, removeRipple } = el._ripple!

  const diff = newBinding.color !== color || newBinding.disabled !== disabled
  if (!diff) return

  el._ripple = assign(
    {
      tasker: newBinding.disabled ? null : tasker,
      removeRipple: removeRipple,
    },
    newBinding,
  )
}

const Ripple = {
  inserted,
  unbind,
  update,
  install(app: VueConstructor) {
    app.directive('ripple', Ripple)
  },
}

export default Ripple
