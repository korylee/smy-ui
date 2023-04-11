import './appDemoTitle.css'

export default {
  name: 'AppDemoTitle',
  functional: true,
  render(h, { children }) {
    return h('div', { staticClass: 'app-demo-title' }, children)
  },
}
