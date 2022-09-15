export * from './compomemts'
export * from './theme'


export const isPhone = () => /Android|webOS|iPhone|iPod|BlackBerry|Pad/i.test(navigator.userAgent)

export const inIframe = () => window.self !== window.top
