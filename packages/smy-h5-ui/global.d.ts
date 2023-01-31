declare module '*.vue' {
  import type { SmyComponent } from './src/_utils/smy/component'
  const component: SmyComponent
  export default component
}
