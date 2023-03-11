import { mount } from '@vue/test-utils'
import Cell from '..'
import Vue from 'vue'
import example from '../example'

test('test cell example', () => {
  const wrapper = mount(example)
  expect(wrapper.html()).toMatchSnapshot()
  wrapper.destroy()
})

test('test cell plugin', () => {
  Vue.use(Cell)
  expect(Vue.component(Cell.name)).toBeTruthy()
})

test('test cell props', async () => {
  const wrapper = mount(Cell, {
    propsData: {
      title: 'This is Cell',
      desc: 'This is desc',
      border: true,
      iconClass: 'test-icon-class',
      titleClass: 'test-title-class',
      descClass: 'test-desc-class',
      extraClass: 'test-extra-class',
    },
    scopedSlots: {
      extra: '<div>text</div>',
    },
  })
  expect(wrapper.classes('smy-cell--border')).toBe(true)
  expect(wrapper.find('.smy-cell__title').text()).toBe('This is Cell')
  expect(wrapper.find('.smy-cell__desc').text()).toBe('This is desc')
  expect(wrapper.find('.test-extra-class').text()).toBe('text')
  expect(wrapper.html()).toMatchSnapshot()
  wrapper.destroy()
})
