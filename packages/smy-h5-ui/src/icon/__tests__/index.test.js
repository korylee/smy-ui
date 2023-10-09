import Vue from 'vue'
import Icon from '..'
import { mount } from '@vue/test-utils'

test('test icon plugin', () => {
  Vue.use(Icon)
  expect(Vue.component(Icon.name)).toBeTruthy()
})

test('test icon onClick', async () => {
  const onClick = jest.fn()
  const wrapper = mount(Icon, { listeners: { click: onClick } })
  await wrapper.trigger('click')
  expect(onClick).toHaveBeenCalledTimes(1)
  wrapper.destroy()
})
