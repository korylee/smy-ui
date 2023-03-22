import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Teleport from '..'

test('test countdown plugin', () => {
  Vue.use(Teleport)
  expect(Vue.component(Teleport.name)).toBeTruthy()
})

const Wrapper = {
  components: {
    SmyTeleport: Teleport,
  },
  data: () => ({ show: true, disabled: false, keepAlive: false, to: 'body' }),
  template: `
    <component :is="keepAlive ? 'keep-alive' : 'div'">
      <smy-teleport v-if="show" :to="to" :disabled="disabled">hello world</smy-teleport>
    </component>
  `,
}

test('test teleport transfer', () => {
  const wrapper = mount(Wrapper)
  expect(wrapper.html()).toMatchSnapshot()
  expect(document.body.innerHTML).toBe('<div class="smy-teleport__container">hello world</div>')

  wrapper.destroy()
  expect(document.body.innerHTML).toBe('')
})

test('test teleport disabled', async () => {
  const wrapper = mount(Wrapper)
  expect(document.body.innerHTML).toBe('<div class="smy-teleport__container">hello world</div>')

  await wrapper.setData({ disabled: true })
  expect(document.body.innerHTML).toBe('')
  expect(wrapper.html()).toMatchSnapshot()
  wrapper.destroy()
})

test('test teleport with keepalive', async () => {
  const wrapper = mount(Wrapper)

  await wrapper.setData({ keepAlive: true })
  expect(document.body.innerHTML).toBe('<div class="smy-teleport__container">hello world</div>')

  await wrapper.setData({ show: false })
  expect(document.body.innerHTML).toBe('')

  await wrapper.setData({ show: true })
  expect(document.body.innerHTML).toBe('<div class="smy-teleport__container">hello world</div>')
  wrapper.destroy()
})

test('test teleport to', async () => {
  document.body.innerHTML = '<div id="app"></div>'
  const wrapper = mount(Wrapper)
  expect(document.body.innerHTML).toMatchSnapshot()

  await wrapper.setData({ to: '#app' })
  expect(document.body.innerHTML).toMatchSnapshot()

  wrapper.destroy()
})
