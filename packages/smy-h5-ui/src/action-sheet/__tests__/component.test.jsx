import { mount } from '@vue/test-utils'
import ActionSheet from '..'

test('should emit select event after clicking option', async () => {
  const wrapper = mount(ActionSheet.Component, {
    propsData: {
      show: true,
      items: [{ name: 'Option' }],
    },
  })

  await wrapper.find('.smy-action-sheet__item').trigger('click')

  expect(wrapper.emitted('select')).toHaveLength(1)
  expect(wrapper.emitted('select')[0]).toEqual([
    {
      name: 'Option',
    },
    0,
  ])
})
