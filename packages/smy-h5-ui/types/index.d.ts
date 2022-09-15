import type { VueConstructor } from 'vue'

export const install: (app: VueConstructor) => void

export const version: string

export * from './card'
export * from './smyComponent'
