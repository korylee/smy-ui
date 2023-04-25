import { getAllParentScroller, inViewport } from '../_utils/dom'
import type { PluginObject, VueConstructor, DirectiveOptions, VNodeDirective, VNode } from 'vue'
import { createLRUCache, removeItem, throttle, merge } from '../_utils/shared'
import { SUPPORT_INTERSECTION } from '../_utils/env'
import Intersect, { type ObserveVNodeDirective } from '../intersect'

interface LazyVNodeDirective extends VNodeDirective {
  value?: string | { src: string; loading?: string; error?: string; attempt?: number | string }
}

export interface LazyOptions {
  loading?: string
  error?: string
  attempt?: number
  throttleWait?: number
  filter?: (lazy: Lazy) => void
  events?: string[]
  observer?: boolean
}

type LazyState = 'pending' | 'success' | 'error'

type Lazy = LazyOptions & {
  src: string
  arg: string | undefined
  currentAttempt: number
  attemptLock: boolean
  state: LazyState
  preloadImage?: HTMLImageElement
}

export interface LazyHTMLElement extends HTMLElement {
  _lazy?: Lazy
}

type ListenTarget = Window | HTMLElement

const LAZY_LOADING = 'lazy-loading'
const LAZY_ERROR = 'lazy-error'
const LAZY_ATTEMPT = 'lazy-attempt'
const EVENTS = ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove']
export const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
const BACKGROUND_IMAGE_ARG_NAME = 'background-image'
const lazyElements: LazyHTMLElement[] = []
const listenTargets: ListenTarget[] = []

export const imageCache = createLRUCache<string, HTMLImageElement>(100)

export const globalLazyOptions: LazyOptions = {
  loading: PIXEL,
  error: PIXEL,
  attempt: 3,
  throttleWait: 300,
  events: EVENTS,
  observer: true,
}

let checkAllWithThrottle = throttle(checkAll, globalLazyOptions.throttleWait)

function setSRC(el: LazyHTMLElement, src: string) {
  if (el._lazy?.arg === BACKGROUND_IMAGE_ARG_NAME) {
    el.style.backgroundImage = `url(${src})`
  } else {
    el.setAttribute('src', src)
  }
}

function setLoading(el: LazyHTMLElement) {
  el._lazy?.loading && setSRC(el, el._lazy.loading)

  // checkAll()
}

function setSuccess(el: LazyHTMLElement, attemptSRC: string) {
  setSRC(el, attemptSRC)
  el._lazy!.state = 'success'

  clear(el)
  // checkAll()
}

function setError(el: LazyHTMLElement) {
  el._lazy?.error && setSRC(el, el._lazy.error)
  el._lazy!.state = 'error'

  clear(el)
  // checkAll()
}

function createLazy(el: LazyHTMLElement, binding: LazyVNodeDirective) {
  const { value, arg } = binding
  const { loading, src, attempt, error } =
    typeof value === 'object' ? value : { src: value, loading: undefined, attempt: undefined, error: undefined }
  if (!src) return
  const lazyOptions: LazyOptions = {
    loading: loading ?? el.getAttribute(LAZY_LOADING) ?? globalLazyOptions.loading,
    error: error ?? el.getAttribute(LAZY_ERROR) ?? globalLazyOptions.error,
    attempt: Number(attempt ?? el.getAttribute(LAZY_ATTEMPT) ?? globalLazyOptions.attempt),
  }

  el._lazy = Object.assign(
    {
      src,
      arg: arg,
      currentAttempt: 0,
      state: 'pending',
      attemptLock: false,
    },
    lazyOptions
  ) as Lazy

  setSRC(el, PIXEL)

  globalLazyOptions.filter?.(el._lazy)
}

function createImage(el: LazyHTMLElement, attemptSRC: string) {
  const image = new Image()
  image.src = attemptSRC
  el._lazy!.preloadImage = image
  image.addEventListener('load', () => {
    el._lazy!.attemptLock = false

    imageCache.put(attemptSRC, image)
    setSuccess(el, attemptSRC)
  })
  image.addEventListener('error', () => {
    el._lazy!.attemptLock = false
    const isError = el._lazy!.currentAttempt >= (el._lazy!.attempt as number)
    isError ? setError(el) : attemptLoad(el)
  })
}

function attemptLoad(el: LazyHTMLElement) {
  const { _lazy } = el
  if (!_lazy || _lazy.attemptLock || _lazy.state !== 'pending') {
    return
  }
  _lazy.attemptLock = true
  _lazy.currentAttempt++

  const { src: attemptSRC }: Lazy = _lazy!

  if (imageCache.has(attemptSRC)) {
    setSuccess(el, attemptSRC)
    _lazy!.attemptLock = false
    return
  }

  setLoading(el)
  createImage(el, attemptSRC)
}

async function add(el: LazyHTMLElement) {
  !lazyElements.includes(el) && lazyElements.push(el)
  getAllParentScroller(el).forEach(bindEvents)
  await check(el)
}

function clear(el: LazyHTMLElement) {
  removeItem(lazyElements, el)
  lazyElements.length === 0 && unbindEvents()
}

async function check(el: LazyHTMLElement) {
  ;(await inViewport(el)) && attemptLoad(el)
}

function checkAll() {
  lazyElements.forEach((el: LazyHTMLElement) => check(el))
}

function bindEvents(listenTarget: ListenTarget) {
  if (listenTargets.includes(listenTarget)) return
  listenTargets.push(listenTarget)
  globalLazyOptions.events?.forEach((event: string) => {
    listenTarget.addEventListener(event, checkAllWithThrottle, { passive: true })
  })
}

function unbindEvents() {
  listenTargets.forEach((listenTarget: ListenTarget) => {
    globalLazyOptions.events?.forEach((event: string) => {
      listenTarget.removeEventListener(event, checkAllWithThrottle)
    })
  })
  listenTargets.length = 0
}

function mounted(el: LazyHTMLElement, binding: LazyVNodeDirective) {
  createLazy(el, binding)
  if (!el._lazy) return

  add(el)
}

const diff = (el: LazyHTMLElement, binding: LazyVNodeDirective) => {
  const { src, arg } = el._lazy!
  const { value, arg: _arg } = binding
  return src !== (typeof value === 'object' ? value.src : value) || arg !== _arg
}

async function update(el: LazyHTMLElement, binding: LazyVNodeDirective) {
  if (SUPPORT_INTERSECTION && globalLazyOptions.observer) {
    return
  }
  if (!el._lazy) return
  if (!diff(el, binding)) {
    lazyElements.includes(el) && (await check(el))
    return
  }
  mounted(el, binding)
}

const createIntersectBinding = (el: HTMLElement): ObserveVNodeDirective => ({
  name: 'intersect',
  value(isIntersecting: boolean) {
    if (isIntersecting) {
      attemptLoad(el)
    }
  },
})

function inserted(el: LazyHTMLElement, binding: LazyVNodeDirective, vnode: VNode) {
  if (SUPPORT_INTERSECTION && globalLazyOptions.observer) {
    createLazy(el, binding)
    Intersect.inserted(el, createIntersectBinding(el), vnode)
    return
  }
  mounted(el, binding)
}

function unbind(el: HTMLElement, binding: VNodeDirective, vnode: VNode) {
  if (SUPPORT_INTERSECTION && globalLazyOptions.observer) {
    Intersect.unbind(el, createIntersectBinding(el), vnode)
    return
  }

  clear(el)
}

export const Lazy: DirectiveOptions & PluginObject<LazyOptions> = {
  inserted,
  unbind,
  update,
  install(app: VueConstructor, lazyOptions?: LazyOptions) {
    const oldThrottleWait = globalLazyOptions.throttleWait
    lazyOptions && merge(globalLazyOptions, lazyOptions)
    const newThrottleWait = globalLazyOptions.throttleWait
    newThrottleWait !== oldThrottleWait && (checkAllWithThrottle = throttle(checkAll, newThrottleWait))
    app.directive('lazy', this)
  },
}

export default Lazy
