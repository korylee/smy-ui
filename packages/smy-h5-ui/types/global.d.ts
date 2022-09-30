// import Vue, { VNode } from 'vue'
//
// declare global {
//   namespace JSX {
//     type Element = VNode
//     type ElementClass = Vue
//     interface InterinsicElements {
//       [elem: string]: any
//     }
//   }
// }

declare module '*.vue' {
  import type { Component } from 'vue'
  const component: Component
  export default component
}
