import { h } from 'vue'
import './appDemoTitle.css'

export default {
  name: 'AppDemoTitle',
  setup(_, { slots }) {
    return () => h('div', { class: 'app-demo-title' }, slots.default?.())
  },
}
