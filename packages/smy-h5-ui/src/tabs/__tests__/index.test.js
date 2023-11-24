import Vue from 'vue'
import Tabs from '..'
import Tab from '../../tab'

test('test tabs & tab plugins', () => {
  Vue.use(Tabs).use(Tab)

  expect(Vue.component(Tabs.name)).toBeTruthy()
  expect(Vue.component(Tab.name)).toBeTruthy()
})
