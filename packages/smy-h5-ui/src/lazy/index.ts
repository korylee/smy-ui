import type { PluginObject, VueConstructor, DirectiveOptions, VNodeDirective, VNode } from 'vue'
import { assign, assignWith, createLRUCache } from '../_utils/shared'
import Intersect, { type ObserveVNodeDirective } from '../intersect'
import { isNil, isObject } from '../_utils/is'

interface LazyVNodeDirective extends VNodeDirective {
  value?: string | { src: string; loading?: string; error?: string; attempt?: number | string }
}

export interface LazyOptions {
  loading?: string
  error?: string
  attempt?: number
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

const LAZY_LOADING = 'lazy-loading'
const LAZY_ERROR = 'lazy-error'
const LAZY_ATTEMPT = 'lazy-attempt'
const EVENTS = ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove']
export const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
const BACKGROUND_IMAGE_ARG_NAME = 'background-image'

export const imageCache = createLRUCache<string, HTMLImageElement>(100)

export const globalLazyOptions: LazyOptions = {
  loading: PIXEL,
  error: PIXEL,
  attempt: 3,
  events: EVENTS,
}

function setSRC(el: LazyHTMLElement, src: string) {
  if (el._lazy?.arg === BACKGROUND_IMAGE_ARG_NAME) {
    el.style.backgroundImage = `url(${src})`
  } else {
    el.setAttribute('src', src)
  }
}

function setLoading(el: LazyHTMLElement) {
  el._lazy?.loading && setSRC(el, el._lazy.loading)
}

function setSuccess(el: LazyHTMLElement, attemptSRC: string) {
  setSRC(el, attemptSRC)
  el._lazy!.state = 'success'
}

function setError(el: LazyHTMLElement) {
  el._lazy?.error && setSRC(el, el._lazy.error)
  el._lazy!.state = 'error'
}

function createLazy(el: LazyHTMLElement, binding: LazyVNodeDirective) {
  const { value, arg } = binding
  const { loading, src, attempt, error } = isObject(value)
    ? value
    : { src: value, loading: undefined, attempt: undefined, error: undefined }
  if (!src) return
  const lazyOptions: LazyOptions = {
    loading: loading ?? el.getAttribute(LAZY_LOADING) ?? globalLazyOptions.loading,
    error: error ?? el.getAttribute(LAZY_ERROR) ?? globalLazyOptions.error,
    attempt: Number(attempt ?? el.getAttribute(LAZY_ATTEMPT) ?? globalLazyOptions.attempt),
  }

  const other = {
    src,
    arg,
    currentAttempt: 0,
    state: 'pending' as LazyState,
    attemptLock: false,
  }
  el._lazy = assign(other, lazyOptions)

  setSRC(el, PIXEL)

  globalLazyOptions.filter?.(el._lazy)
}

function createImage(el: LazyHTMLElement, attemptSRC: string) {
  const image = new Image()
  image.src = attemptSRC
  const { _lazy } = el
  if (!_lazy) return
  _lazy.preloadImage = image
  image.addEventListener('load', () => {
    _lazy.attemptLock = false

    imageCache.put(attemptSRC, image)
    setSuccess(el, attemptSRC)
  })
  image.addEventListener('error', () => {
    _lazy.attemptLock = false
    const isError = _lazy.currentAttempt >= (_lazy.attempt as number)
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

const diff = (el: LazyHTMLElement, binding: LazyVNodeDirective) => {
  const { src, arg } = el._lazy!
  const { value, arg: _arg } = binding
  return src !== (isObject(value) ? value.src : value) || arg !== _arg
}

function update(el: LazyHTMLElement, binding: LazyVNodeDirective) {
  if (!el._lazy) return
  if (!diff(el, binding)) {
    return
  }
  createLazy(el, binding)
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
  createLazy(el, binding)
  Intersect.inserted(el, createIntersectBinding(el), vnode)
}

function unbind(el: HTMLElement, binding: VNodeDirective, vnode: VNode) {
  Intersect.unbind(el, createIntersectBinding(el), vnode)
}

export const Lazy: DirectiveOptions & PluginObject<LazyOptions> = {
  inserted,
  unbind,
  update,
  install(app: VueConstructor, lazyOptions?: LazyOptions) {
    lazyOptions && assignWith(globalLazyOptions, lazyOptions, (t, s) => (isNil(s) ? t : s))
    app.directive('lazy', this)
  },
}

export default Lazy
