import type { VueConstructor } from 'vue'

export class SmyComponent {
  static name: string

  static install(app: VueConstructor): void
}
