import { doubleRaf, kebabCase } from './shared'

export function formatStyleVars(styleVars: Record<string, string>) {
  return Object.entries(styleVars).reduce((styles, [key, value]) => {
    const cssVar = key.startsWith('--') ? key : `--${kebabCase(key)}`
    styles[cssVar] = value
    return styles
  }, {})
}

export function getAllParentScroller(el: HTMLElement): Array<HTMLElement | Window> {
  const allParentScroller: Array<HTMLElement | Window> = []
  let element: HTMLElement | Window = el
  while (element !== window) {
    element = getParentScroller(element as HTMLElement)
    allParentScroller.push(element)
  }
  return allParentScroller
}

export function getParentScroller(el: HTMLElement): HTMLElement | Window {
  let element = el
  while (element) {
    if (!element.parentNode) break
    element = element.parentNode as HTMLElement
    if (element === document.body || element === document.documentElement) {
      break
    }
    const scrollRE = /(scroll|auto)/
    const { overflowY, overflow } = window.getComputedStyle(element)
    if (scrollRE.test(overflowY) || scrollRE.test(overflow)) {
      return element
    }
  }
  return window
}

/**
 * 检查当前dom是否在视口，getBoundingClientRect这方案终究还是有性能问题，后续看有无必要换方案
 */
export async function inViewport(el: HTMLElement): Promise<boolean> {
  await doubleRaf()
  const { top, bottom, left, right } = el.getBoundingClientRect()
  const { innerWidth, innerHeight } = window
  const xInViewport = left <= innerWidth && right >= 0
  const yInViewport = top <= innerHeight && bottom >= 0

  return xInViewport && yInViewport
}
