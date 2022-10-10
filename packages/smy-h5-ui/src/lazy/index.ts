import type { PluginObject, VueConstructor, DirectiveOptions } from 'vue'
import type { DirectiveBinding } from 'vue/types/options'
import { createLRUCache, inViewport, removeItem, getAllParentScroller, throttle, merge } from '../_utils/shared'

interface LazyOptions {
  loading?: string
  error?: string
  attempt?: number
  throttleWait?: number
  filter?: (lazy: Lazy) => void
  events?: string[]
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

export const defaultLazyOptions: LazyOptions = {
  loading: PIXEL,
  error: PIXEL,
  attempt: 3,
  throttleWait: 300,
  events: EVENTS,
}

let checkAllWithThrottle = throttle(checkAll, defaultLazyOptions.throttleWait)

function setSRC(el: LazyHTMLElement, src: string) {
  if (el._lazy?.arg === BACKGROUND_IMAGE_ARG_NAME) {
    el.style.backgroundImage = `url(${src})`
  } else {
    el.setAttribute('src', src)
  }
}

function setLoading(el: LazyHTMLElement) {
  el._lazy?.loading && setSRC(el, el._lazy.loading)

  checkAll()
}

function setSuccess(el: LazyHTMLElement, attemptSRC: string) {
  setSRC(el, attemptSRC)
  el._lazy!.state = 'success'

  clear(el)
  checkAll()
}

function setError(el: LazyHTMLElement) {
  el._lazy?.error && setSRC(el, el._lazy.error)
  el._lazy!.state = 'error'

  clear(el)
  checkAll()
}

function createLazy(el: LazyHTMLElement, binding: DirectiveBinding) {
  const lazyOptions: LazyOptions = {
    loading: el.getAttribute(LAZY_LOADING) ?? defaultLazyOptions.loading,
    error: el.getAttribute(LAZY_ERROR) ?? defaultLazyOptions.error,
    attempt: Number(el.getAttribute(LAZY_ATTEMPT) ?? defaultLazyOptions.attempt),
  }

  el._lazy = {
    src: binding.value,
    arg: binding.arg,
    currentAttempt: 0,
    state: 'pending',
    attemptLock: false,
    ...lazyOptions,
  }

  setSRC(el, PIXEL)

  defaultLazyOptions.filter?.(el._lazy)
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
  if (el._lazy!.attemptLock) {
    return
  }
  el._lazy!.attemptLock = true
  el._lazy!.currentAttempt++

  const { src: attemptSRC }: Lazy = el._lazy!

  if (imageCache.has(attemptSRC)) {
    setSuccess(el, attemptSRC)
    el._lazy!.attemptLock = false
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
  defaultLazyOptions.events?.forEach((event: string) => {
    listenTarget.addEventListener(event, checkAllWithThrottle, { passive: true })
  })
}

function unbindEvents() {
  listenTargets.forEach((listenTarget: ListenTarget) => {
    defaultLazyOptions.events?.forEach((event: string) => {
      listenTarget.removeEventListener(event, checkAllWithThrottle)
    })
  })
  listenTargets.length = 0
}

async function mounted(el: LazyHTMLElement, binding: DirectiveBinding) {
  createLazy(el, binding)

  await add(el)
}

const diff = (el: LazyHTMLElement, binding: DirectiveBinding) => {
  const { src, arg } = el._lazy!
  return src !== binding.value || arg !== binding.arg
}

async function update(el: LazyHTMLElement, binding: DirectiveBinding) {
  if (!diff(el, binding)) {
    lazyElements.includes(el) && (await check(el))
    return
  }
  await mounted(el, binding)
}

const Lazy: DirectiveOptions & PluginObject<LazyOptions> = {
  inserted: mounted,
  unbind: clear,
  update,
  install(app: VueConstructor, lazyOptions?: LazyOptions) {
    merge(defaultLazyOptions, lazyOptions)
    checkAllWithThrottle = throttle(checkAll, defaultLazyOptions.throttleWait)
    app.directive('lazy', this)
  },
}

export default Lazy
