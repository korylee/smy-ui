import { mount } from '@vue/test-utils'
import example from '../example'
import Badge from '..'
import Vue from 'vue'
import { mockConsole } from '../../../jest-utils'

test('test badge example', () => {
  const reset = mockConsole()
  const wrapper = mount(example)

  expect(wrapper.html()).toMatchSnapshot()
  wrapper.destroy()
  reset()
})

test('test badge plugin', () => {
  Vue.use(Badge)
  expect(Vue.component(Badge.name)).toBeTruthy()
})

test('test badge value and max', async () => {
  const wrapper = mount(Badge, {
    propsData: { value: 72 },
  })

  expect(wrapper.find('.smy-badge').text()).toBe('72')
  await wrapper.setProps({ max: 60 })
  expect(wrapper.find('.smy-badge').text()).toBe('60+')
})

test('test badge hidden', () => {
  const wrapper = mount(Badge, {
    propsData: { hidden: true },
  })
  expect(wrapper.find('.smy-badge__content').isVisible()).toBe(false)
})

test('test badge dot', async () => {
  const wrapper = mount(Badge, {
    propsData: { dot: true, value: 72 },
  })
  expect(wrapper.find('.smy-badge__content--dot').exists()).toBe(true)

  expect(wrapper.find('.smy-badge').text()).toBe('')
})

test('test badge position', async () => {
  const template = `
    <smy-badge>
      <div style="width: 100px; height: 100px;"></div>
    </smy-badge>
  `
  const wrapper = mount({
    components: { SmyBadge: Badge },
    template,
  })
  expect(wrapper.html()).toMatchSnapshot()

  await wrapper.setProps({ position: 'right-bottom' })
  expect(wrapper.html()).toMatchSnapshot()

  await wrapper.setProps({ position: 'left-top' })
  expect(wrapper.html()).toMatchSnapshot()

  await wrapper.setProps({ position: 'left-bottom' })
  expect(wrapper.html()).toMatchSnapshot()
})

test('test badge style', () => {
  const wrapper = mount(Badge, {
    propsData: {
      color: '#6200ea',
      top: '100',
      right: '1000',
      zIndex: 500,
    },
  })

  expect(wrapper.html()).toMatchSnapshot()
})
