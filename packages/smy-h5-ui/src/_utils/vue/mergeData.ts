import { camelize, isString } from '@smy-h5/shared'

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
