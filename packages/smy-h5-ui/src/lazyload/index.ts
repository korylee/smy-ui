/* eslint-disable @typescript-eslint/no-unused-vars */
import { assign, assignWith, createLRUCache } from '../_utils/shared'
import Intersect, { type ObserveVNodeDirective } from '../intersect'
import { isNil, isObject } from '../_utils/is'
import { DirectiveBinding } from 'vue'

type ValueOf<T> = T[keyof T]

interface LazyloadBaseOptions {
  loading?: string
  error?: string
  attempt?: number
  filter?: (lazy: LazyloadStore) => void
}

interface LazyloadHandlers {
  onSuccess?: (el?: LazyHTMLElement) => void
  onError?: (el?: LazyHTMLElement) => void
}

export type LazyloadOptions = Omit<LazyloadBaseOptions, 'attempt'> & { attempt?: number | string } & LazyloadHandlers

type LazyloadValue =
  | {
      src: string
      options?: LazyloadOptions
    }
  | ({ src: string } & LazyloadOptions)

type LazyloadVNodeDirective = DirectiveBinding<string | LazyloadValue | undefined>

interface LazyloadStore extends LazyloadBaseOptions, LazyloadHandlers {
  src: string
  arg: string | undefined
  currentAttempt: number
  attemptLock: boolean
  state: LazyloadState
  preloadImage?: HTMLImageElement
}

export interface LazyHTMLElement extends HTMLElement {
  _lazy?: LazyloadStore
}

const LAZY_LOADING = 'lazy-loading'
const LAZY_ERROR = 'lazy-error'
const LAZY_ATTEMPT = 'lazy-attempt'
export const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
const BACKGROUND_IMAGE_ARG_NAME = 'background-image'
export const LAZYLOAD_STATE = Object.freeze({
  PENDING: 'pending',
  SUCCESS: 'success',
  ERROR: 'error',
})

type LazyloadState = ValueOf<typeof LAZYLOAD_STATE>

export const imageCache = createLRUCache<string, HTMLImageElement>(100)

export const globalLazyloadOptions: LazyloadBaseOptions = {
  loading: PIXEL,
  error: PIXEL,
  attempt: 3,
}

function setSRC(el: LazyHTMLElement, src: string) {
  if (el._lazy?.arg === BACKGROUND_IMAGE_ARG_NAME) {
    el.style.backgroundImage = `url(${src})`
  } else {
    el.setAttribute('src', src)
  }
}

function setLoading(el: LazyHTMLElement) {
  const _lazy = el._lazy!
  _lazy.loading && setSRC(el, _lazy.loading)
}

function setSuccess(el: LazyHTMLElement, attemptSRC: string) {
  setSRC(el, attemptSRC)
  const _lazy = el._lazy!
  _lazy.state = LAZYLOAD_STATE.SUCCESS
  _lazy.onSuccess?.(el)
}

function setError(el: LazyHTMLElement) {
  const _lazy = el._lazy!
  _lazy.error && setSRC(el, _lazy.error)
  _lazy.state = LAZYLOAD_STATE.ERROR
  _lazy.onError?.(el)
}

function createLazy(el: LazyHTMLElement, binding: LazyloadVNodeDirective) {
  const { value, arg } = binding
  const { src, options, ...otherOptions } = (isObject(value) ? value : { src: value }) as any
  const { loading, attempt, error, onError, onSuccess, filter } = options ?? otherOptions ?? ({} as LazyloadOptions)
  if (!src) return
  const lazyOptions: LazyloadBaseOptions = {
    loading: loading ?? el.getAttribute(LAZY_LOADING) ?? globalLazyloadOptions.loading,
    error: error ?? el.getAttribute(LAZY_ERROR) ?? globalLazyloadOptions.error,
    attempt: Number(attempt ?? el.getAttribute(LAZY_ATTEMPT) ?? globalLazyloadOptions.attempt),
    filter: filter ?? globalLazyloadOptions.filter,
  }

  const other = {
    src,
    arg,
    currentAttempt: 0,
    state: LAZYLOAD_STATE.PENDING as LazyloadState,
    attemptLock: false,
    onError,
    onSuccess,
  }
  el._lazy = assign(other, lazyOptions)

  setSRC(el, PIXEL)

  globalLazyloadOptions.filter?.(el._lazy)
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
  if (!_lazy) return
  const { src: attemptSRC, attemptLock, state } = _lazy
  if (attemptLock || state !== LAZYLOAD_STATE.PENDING) {
    return
  }
  _lazy.attemptLock = true
  _lazy.currentAttempt++

  if (imageCache.has(attemptSRC)) {
    setSuccess(el, attemptSRC)
    _lazy!.attemptLock = false
    return
  }

  setLoading(el)
  createImage(el, attemptSRC)
}

const diff = (el: LazyHTMLElement, binding: LazyloadVNodeDirective) => {
  const { src, arg } = el._lazy!
  const { value, arg: _arg } = binding
  return src !== (isObject(value) ? value.src : value) || arg !== _arg
}

export function useLazyload() {}
