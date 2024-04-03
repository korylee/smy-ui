import { convertToUnit, Numeric, isArray, isNil, kebabCase } from '@smy-h5/shared'

export type StyleVars = Record<string, string>

export function formatStyleVars(styleVars: StyleVars) {
  return Object.entries(styleVars).reduce((styles, [key, value]) => {
    const cssVar = key.startsWith('--') ? key : `--${kebabCase(key)}`
    styles[cssVar] = value
    return styles
  }, {} as StyleVars)
}

export function getSizeStyle(originSize?: Numeric | Numeric[]) {
  if (isNil(originSize)) return
  if (isArray(originSize)) {
    return {
      width: convertToUnit(originSize[0]),
      height: convertToUnit(originSize[1]),
    }
  }
  const size = convertToUnit(originSize)
  return { width: size, height: size }
}
