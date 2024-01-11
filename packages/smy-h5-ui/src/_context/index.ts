import Vue from 'vue'

export const reactiveConxtext = Vue.observable({
  locks: {} as Record<any, number>,
  zIndex: 1000,
  thouchmoveForbid: true,
  enableRipple: true,
})

export default reactiveConxtext
