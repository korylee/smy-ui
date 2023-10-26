import { camelize } from '../shared'
import { isString } from '../is'

const pattern = {
  styleList: /;(?![^(]*\))/g,
  styleProp: /:(.*)/,
} as const

export function parseStyle(style: string) {
  const styleMap: Record<string, any> = {}
  const styleList = style.split(pattern.styleList)
  styleList.forEach((s) => {
    let [key, val] = s.split(pattern.styleProp)
    key = key.trim()
    if (!key) return
    if (isString(val)) val = val.trim()
    styleMap[camelize(key)] = val
  })
  return styleMap
}

export function mergeStyles(...args: (string | undefined | object | object[])[]) {
  const result: object[] = []
  args.forEach((arg) => {
    if (!arg) return
    result.push(isString(arg) ? parseStyle(arg) : arg)
  })
  return result
}

/**
export function mergeClasses(...args: (undefined | string | object[] | object)[]) {
  return args.reduce((acc, cur) => {
    if (!cur) return acc
    if (!acc) return cur
    return wrapInArray(acc).concat(cur)
  })
}

type Listener = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [k: string]: Function | Function[]
}

export function mergeListeners(...args: (Listener | undefined)[]) {
  return args.reduce((acc, cur) => {
    if (!cur) return acc
    if (!acc) return cur
    for (const event of keys(cur)) {
      const curEvent = cur[event]
      if (!curEvent) continue
      if (acc[event]) {
        acc[event] = wrapInArray(acc[event]).concat(curEvent)
      } else {
        acc[event] = curEvent
      }
    }
    return acc
  }, {} as Listener)
}

export function mergeData(...args: VNodeData[]) {
  const mergeTarget: VNodeData = {}
  let i = args.length
  while (i--) {
    const arg = args[i]
    if (!arg) continue
    for (const prop of keys(arg)) {
      const value = arg[prop]
      switch (prop) {
        case 'class':
        case 'directives':
          if (value) {
            mergeTarget[prop] = mergeClasses(mergeTarget[prop], value)
          }
          break
        case 'style':
          if (!value) break
          mergeTarget[prop] = mergeStyles(mergeTarget[prop], value)
          break
        case 'staticClass':
          if (!value) break
          if (!mergeTarget[prop]) {
            mergeTarget[prop] = ''
          } else {
            mergeTarget[prop] += ' '
          }
          mergeTarget[prop] += value.trim()
          break
        case 'on':
        case 'nativeOn':
          if (!value) break
          mergeTarget[prop] = mergeListeners(mergeTarget[prop], value)
          break
        case 'attrs':
        case 'props':
        case 'domProps':
        case 'scopedSlots':
        case 'staticStyle':
        case 'hook':
        case 'transition':
          if (!value) break
          if (!mergeTarget[prop]) {
            mergeTarget[prop] = {}
          }
          mergeTarget[prop] = assign({}, value, mergeTarget[prop])
          break
        default: // slot, key, ref, tag, show, keepAlive
          if (!mergeTarget[prop]) {
            ;(mergeTarget as any)[prop] = value
          }
      }
    }
  }
  return mergeTarget
}

**/
