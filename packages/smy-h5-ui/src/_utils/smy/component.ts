import type { VueConstructor } from 'vue'

export declare class SmyComponent {
  static name: string
  install: (app: VueConstructor) => void
}
