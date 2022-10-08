import Vue from 'vue'

interface Context {
  locks: Record<any, number>
  zIndex: number
  thouchmoveForbid: boolean
}

const reactiveConxtext = Vue.observable<Context>({
  locks: {},
  zIndex: 1000,
  thouchmoveForbid: true,
})

export default reactiveConxtext
