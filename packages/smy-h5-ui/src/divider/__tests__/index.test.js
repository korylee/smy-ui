import Vue from 'vue'
import Divider from '..'
import { mount } from '@vue/test-utils'

test('test divider plugin', () => {
  Vue.use(Divider)
  expect(Vue.component(Divider.name)).toBeTruthy()
})

describe('test divider component props', () => {
  test('test divider vertical', async () => {
    const wrapper = mount(Divider, {
      propsData: { vertical: true },
    })
    expect(wrapper.find('.smy-divider--vertical').exists()).toBe(true)
    await wrapper.setProps({ vertical: false })
    expect(wrapper.find('.smy-divider--vertical').exists()).toBe(false)
    wrapper.destroy()
  })

  test('test divider dashed', async () => {
    const wrapper = mount(Divider, { propsData: { dashed: true } })

    expect(wrapper.find('.smy-divider--dashed').exists()).toBe(true)
    await wrapper.setProps({ dashed: false })
    expect(wrapper.find('.smy-divider--dashed').exists()).toBe(false)
    wrapper.destroy()
  })
})
