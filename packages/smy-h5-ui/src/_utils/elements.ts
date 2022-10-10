import { kebabCase } from './shared'

export function formatStyleVars(styleVars: Record<string, string>) {
  return Object.entries(styleVars).reduce((styles, [key, value]) => {
    const cssVar = key.startsWith('--') ? key : `--${kebabCase(key)}`
    styles[cssVar] = value
    return styles
  }, {})
}
