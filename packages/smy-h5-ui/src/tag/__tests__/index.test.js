import { mount } from '@vue/test-utils'
import Tag from '..'

test('should emit close event when clicking the close icon', () => {
  const wrapper = mount(Tag, {
    propsData: {
      closeable: true,
    },
  })

  wrapper.find('.smy-tag__close').trigger('click')
  expect(wrapper.emitted('close').length).toEqual(1)

  wrapper.destroy()
})

test('should render textColor correctly', () => {
  const wrapper = mount(Tag, {
    propsData: {
      plain: true,
      color: 'red',
      textColor: 'blue',
    },
  })

  expect(wrapper.html()).toMatchSnapshot()
  wrapper.destroy()
})
