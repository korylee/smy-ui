import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Stepper from '..'

test('test stepper plugin', () => {
  Vue.use(Stepper)
  expect(Vue.component(Stepper.name)).toBeTruthy()
})

test('test stepper increment & decrement', async () => {
  const wrapper = mount({
    component: { [Stepper.name]: Stepper },
    data: () => ({ value: 0 }),
    template: `<smy-stepper v-model="value" />`,
  })

  const plus = wrapper.find('.smy-stepper__plus')
  await plus.trigger('click')
  expect(wrapper.vm.value).toBe(1)

  const minus = wrapper.find('.smy-stepper__minus')
  await minus.trigger('click')
  expect(wrapper.vm.value).toBe(0)

  wrapper.destroy()
})

test('test stepper initial value over max', async () => {
  const wrapper = mount({
    components: {
      [Stepper.name]: Stepper,
    },
    data: () => ({
      value: 11,
    }),
    template: `<smy-stepper v-model="value" :max="10" />`,
  })
  expect(wrapper.vm.value).toBe(10)

  wrapper.destroy()
})
