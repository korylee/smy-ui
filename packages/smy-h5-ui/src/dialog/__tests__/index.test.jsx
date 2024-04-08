import { mount } from '@vue/test-utils'
import _Dialog from '..'

const Dialog = _Dialog.Component

test('should change confirm button color when using confirm-button-color prop', () => {
  const wrapper = mount(Dialog, {
    propsData: {
      show: true,
      confirmColor: 'red',
    },
  })
  const confirmButton = wrapper.find('.smy-dialog__confirm')
  expect(confirmButton.attributes('style')).toContain('color: red;')
})
