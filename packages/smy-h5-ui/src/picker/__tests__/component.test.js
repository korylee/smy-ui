import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Picker from '..'
import { mockConsole, triggerDrag } from '../../../jest-utils'
import example from '../example'

test('test picker compomemt plugin', () => {
  Vue.use(Picker.Component)
  expect(Vue.component(Picker.Component.name)).toBeTruthy()
})

test('test picker example', () => {
  const restore = mockConsole('log')
  const wrapper = mount(example)
  expect(wrapper.html()).toMatchSnapshot()
  wrapper.destroy()
  restore()
})

const columns = [['A', 'B', 'C']]

test('test scroll up & onConfirm', async () => {
  const onConfirm = jest.fn()

  const wrapper = mount(Picker.Component, {
    propsData: { show: true, columns },
    listeners: { confirm: onConfirm },
  })
  expect(wrapper.html()).toMatchSnapshot()
  const { element } = wrapper.find('.smy-picker__column')

  await triggerDrag(element, 0, -600)
  expect(wrapper.html()).toMatchSnapshot()

  await wrapper.find('.smy-picker__confirm-button').trigger('click')
  expect(onConfirm).lastCalledWith(['C'], [2])

  wrapper.destroy()
})
