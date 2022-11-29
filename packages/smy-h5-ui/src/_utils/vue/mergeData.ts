import { camelize } from '../shared'

const pattern = {
  styleList: /;(?![^(]*\))/g,
  styleProp: /:(.*)/,
} as const

export function parseStyle(style: string) {
  const styleMap: Record<string, any> = {}
  for (const s of style.split(pattern.styleList)) {
    let [key, val] = s.split(pattern.styleProp)
    key = key.trim()
    if (!key) continue
    if (typeof val === 'string') val = val.trim()
    styleMap[camelize(key)] = val
  }
  return styleMap
}

export function mergeStyles(...args: (string | undefined | object | object[])[]) {
  const result: object[] = []
  for (const arg of args) {
    if (!arg) continue
    result.push(typeof arg === 'string' ? parseStyle(arg) : arg)
  }
  return result
}
