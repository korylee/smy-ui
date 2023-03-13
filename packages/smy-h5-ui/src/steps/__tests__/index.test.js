import { mount } from '@vue/test-utils'
import Step from '../../step'
import example from '../example'
import Steps from '..'
import Vue from 'vue'

test('test steps example', () => {
  const wrapper = mount(example)

  expect(wrapper.html()).toMatchSnapshot()
  wrapper.destroy()
})

test('test steps and step plugin', () => {
  Vue.use(Steps).use(Step)

  expect(Vue.component(Steps.name)).toBeTruthy()
  expect(Vue.component(Step.name)).toBeTruthy()
})

test('test step direction prop', async () => {
  const template = `
    <smy-steps :vertical="vertical">
      <smy-step>步骤1</smy-step>
      <smy-step>步骤2</smy-step>
    </smy-steps>
  `
  const wrapper = mount(
    {
      data: () => ({ vertical: false }),
      components: { SmySteps: Steps, SmyStep: Step },
      template,
    },
    { attachTo: document.body }
  )
  expect(wrapper.html()).toMatchSnapshot()

  await wrapper.setData({ vertical: true })
  expect(wrapper.html()).toMatchSnapshot()

  wrapper.destroy()
})

test('test step event', async () => {
  const clickStep = jest.fn()
  const template = `
  <smy-steps :current="current" @click-step="clickStep">
   <smy-step>步骤1</smy-step>
   <smy-step>步骤2</smy-step>
 </smy-steps>
`
  const wrapper = mount(
    {
      template,
      data: () => ({ current: 1 }),
      components: { SmySteps: Steps, SmyStep: Step },
      methods: {
        clickStep,
      },
    },
    { attachTo: document.body }
  )
  expect(wrapper.html()).toMatchSnapshot()

  await wrapper.find('.smy-step').trigger('click')
  expect(clickStep).toHaveBeenCalledTimes(1)
  wrapper.destroy()
})
