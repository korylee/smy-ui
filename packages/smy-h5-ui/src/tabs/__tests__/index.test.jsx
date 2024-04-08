import Tabs from '..'
import Tab from '../../tab'
import { mount } from '@vue/test-utils'
import { delay } from '../../../jest-utils'

test('should emit clickTab event when tab is clicked', async () => {
  const onClickTab = jest.fn()
  const wrapper = mount({
    render() {
      return (
        <Tabs onClickTab={onClickTab}>
          <Tab title="title1"></Tab>
          <Tab title="title2"></Tab>
        </Tabs>
      )
    },
  })
  await delay()
  const tabs = wrapper.findAll('.smy-tab')
  await tabs.at(0).trigger('click')
  expect(onClickTab).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 0,
      title: 'title1',
      disabled: false,
    }),
  )
})

test('should switch tab after click the tab title', async () => {
  const onChange = jest.fn()
  const wrapper = mount({
    render() {
      return (
        <Tabs onChange={onChange}>
          <Tab title="title1">Text</Tab>
          <Tab title="title2">Text</Tab>
          <Tab title="title3" disabled>
            Text
          </Tab>
        </Tabs>
      )
    },
  })
  await delay()
  expect(wrapper.html()).toMatchSnapshot()

  const tabs = wrapper.findAll('.smy-tab')
  await tabs.at(1).trigger('click')
  await tabs.at(2).trigger('click')
  await delay()
  expect(wrapper.html()).toMatchSnapshot()
  expect(onChange).toHaveBeenCalledTimes(1)
})
