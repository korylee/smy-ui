export * from './compomemts'
export * from './theme'

export const isPhone = () => /phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone/i.test(navigator.userAgent)

export const inIframe = () => window.self !== window.top
