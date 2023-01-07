declare module '*.vue' {
  import type { SmyComponent } from './src/_utils/components'
  const component: SmyComponent
  export default component
}
