import type { VueConstructor } from 'vue'

export const install: (app: VueConstructor) => void

export const version: string

export * from './card'
export * from './img-preview'
export * from './loading'
export * from './smyComponent'
export * from './toast'
