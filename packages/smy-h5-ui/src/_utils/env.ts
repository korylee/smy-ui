export const IN_BROWSER = typeof window !== 'undefined'
export const IN_IOS = IN_BROWSER && /ios|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
export const IS_SUPPORT_TOUCH = IN_BROWSER && 'ontouchstart' in window
