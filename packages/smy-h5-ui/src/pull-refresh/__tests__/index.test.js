import { mount } from '@vue/test-utils'
import Vue from 'vue'
import PullRefresh from '..'
import { delay, trigger } from '../../../jest-utils'

const Wrapper = {
  template: `<smy-pull-refresh v-model="isRefresh" v-on="$listeners">
  <div style="height: 200px; width: 100%"></div>
</smy-pull-refresh>`,
  components: { [PullRefresh.name]: PullRefresh },
  data: () => ({ isRefresh: false }),
}

test('test pull-refresh plugin', () => {
  Vue.use(PullRefresh)
  expect(Vue.component(PullRefresh.name)).toBeTruthy()
})

test('test pull-refresh success state', async () => {
  const onRefresh = jest.fn()
  const wrapper = mount(Wrapper, {
    listeners: { refresh: onRefresh },
  })
  const el = wrapper.find('.smy-pull-refresh')

  await trigger(el, 'touchstart', 0, 0)
  await trigger(el, 'touchmove', 0, 200)
  await trigger(el, 'touchend', 0, 150)

  await delay(200)

  expect(wrapper.vm.isRefresh).toBe(true)
  expect(onRefresh).toHaveBeenCalledTimes(1)

  wrapper.destroy()
})
