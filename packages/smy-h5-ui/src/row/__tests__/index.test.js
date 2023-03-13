import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Row from '..'
import Col from '../../col'
import example from '../example'

test('test row example', () => {
  const wrapper = mount(example)
  expect(wrapper.html()).toMatchSnapshot()
  wrapper.destroy()
})

test('test row & col plugin', () => {
  Vue.use(Row).use(Col)
  expect(Vue.component(Row.name)).toBeTruthy()
  expect(Vue.component(Col.name)).toBeTruthy()
})

test('test row flex', async () => {
  const wrapper = mount(Row)
  await Vue.nextTick()

  await wrapper.setProps({ justify: 'flex-start' })
  expect(wrapper.html()).toMatchSnapshot()

  await wrapper.setProps({ justify: 'flex-end' })
  expect(wrapper.html()).toMatchSnapshot()

  await wrapper.setProps({ justify: 'center' })
  expect(wrapper.html()).toMatchSnapshot()

  await wrapper.setProps({ justify: 'space-between' })
  expect(wrapper.html()).toMatchSnapshot()

  await wrapper.setProps({ justify: 'space-around' })
  expect(wrapper.html()).toMatchSnapshot()

  await wrapper.setProps({ align: 'flex-start' })
  expect(wrapper.html()).toMatchSnapshot()

  await wrapper.setProps({ align: 'flex-end' })
  expect(wrapper.html()).toMatchSnapshot()

  await wrapper.setProps({ align: 'center' })
  expect(wrapper.html()).toMatchSnapshot()

  wrapper.destroy()
})

test('test row click', async () => {
  const onClick = jest.fn()
  const wrapper = mount(Row, {
    listeners: { click: onClick },
  })

  await wrapper.trigger('click')
  expect(onClick).toHaveBeenCalledTimes(1)

  await wrapper.find('.smy-row').trigger('click')
  expect(onClick).toHaveBeenCalledTimes(2)

  wrapper.destroy()
})

test('test col in row', async () => {
  const template = `
  <smy-row>
    <smy-col :span="span" :offset="offset">1</smy-col>
    <smy-col :span="12">2</smy-col>
  </smy-row>
  `
  const wrapper = mount({
    data: () => ({
      span: 8,
      offset: 4,
    }),
    components: { SmyCol: Col, SmyRow: Row },
    template,
  })
  expect(wrapper.html()).toMatchSnapshot()
  await wrapper.setData({ span: 12, offset: 0 })
  expect(wrapper.html()).toMatchSnapshot()

  wrapper.destroy()
})
