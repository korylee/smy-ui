import { kebabCase } from '@smy-h5/shared'

const mountedVarKeys = []

function StyleProvider(styleVars) {
  mountedVarKeys.forEach((key) => document.documentElement.style.removeProperty(key))
  mountedVarKeys.length = 0
  const styles = formatStyleVars(styleVars)
  Object.entries(styles).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value)
    mountedVarKeys.push(key)
  })
}

function formatStyleVars(styleVars) {
  return Object.entries(styleVars ?? {}).reduce((styles, [key, value]) => {
    const cssVar = key.startsWith('--') ? key : `--${kebabCase(key)}`
    styles[cssVar] = value
    return styleVars
  }, {})
}

export function setTheme(config, name) {
  const theme = config?.[name] ?? {}
  const styleVars = Object.entries(theme).reduce((styleVar, [key, value]) => {
    styleVar[`--site-config-${key}`] = value
    return styleVar
  }, {})
  StyleProvider(styleVars)
}

export function getBrowserTheme(themeStorageKey = 'SMY_THEME') {
  let currentThemes = window.localStorage.getItem(themeStorageKey)
  if (!currentThemes) {
    currentThemes = window.matchMedia?.('(prefers-color-scheme:dark)').matches ? 'darkTheme' : 'lightTheme'
    window.localStorage.setItem(themeStorageKey, currentThemes)
  }
  return currentThemes
}
