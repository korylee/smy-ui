import { kebabCase, get } from 'lodash-es'

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

export function setThemes(config, name) {
  const themes = get(config, name, {})
  const styleVars = Object.entries(themes).reduce((styleVar, [key, value]) => {
    styleVar[`--site-config-${key}`] = value
    return styleVar
  }, {})
  StyleProvider(styleVars)
}

export function getBrowserThemes(themes = 'SMY_THEME') {
  let currentThemes = window.localStorage.getItem(themes)
  if (!currentThemes) {
    currentThemes = window.matchMedia?.('(prefers-color-scheme:dark)').matches ? 'darkThemes' : 'themes'
    window.localStorage.setItem(themes, currentThemes)
  }
  return currentThemes
}
