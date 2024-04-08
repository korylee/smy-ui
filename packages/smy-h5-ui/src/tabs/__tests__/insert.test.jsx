import { mount } from '@vue/test-utils'
import Tabs from '../Tabs'
import Tab from '../../tab'
import { delay } from '../../../jest-utils'

test('should render correctly after inserting a tab', async () => {
  const wrapper = mount({
    components: { SmyTab: Tab, SmyTabs: Tabs },
    data: () => ({
      insert: false,
      active: 1,
    }),
    template: `\
    <smy-tabs :active.sync="active">
      <smy-tab title="1">1</smy-tab>
      <smy-tab v-if="insert" title="2">2</smy-tab>
      <smy-tab title="3">3</smy-tab>
    </smy-tabs>
    `,
  })
  await delay()
  await wrapper.setData({ insert: true })
  await delay()
  expect(wrapper.html()).toMatchSnapshot()
})
