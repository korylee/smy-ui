import { mount } from '@vue/test-utils'
import Checkbox from '..'

test('should emit "input" event when checkbox icon is checked', async () => {
  const wrapper = mount(Checkbox)

  const icon = wrapper.find('.smy-checkbox__icon')
  icon.trigger('click')
  expect(wrapper.emitted('input')[0]).toEqual([true])

  await wrapper.setProps({ checked: true })
  icon.trigger('click')
  expect(wrapper.emitted('input')[1]).toEqual([false])
})

test('should emit change event when checked is changed', async () => {
  const wrapper = mount(Checkbox)

  const icon = wrapper.find('.smy-checkbox__icon')
  icon.trigger('click')
  await wrapper.setProps({ checked: true })
  expect(wrapper.emitted('change')[0]).toEqual([true])

  icon.trigger('click')
  await wrapper.setProps({ checked: false })
  expect(wrapper.emitted('change')[1]).toEqual([false])
})

test('should render "smy-checkbox--label-disabled" class when using label-disabled prop', async () => {
  const wrapper = mount(Checkbox, {
    propsData: {
      labelDisabled: true,
    },
    slots: {
      default: 'label',
    },
  })
  expect(wrapper.classes()).toContain('smy-checkbox--label-disabled')
  const label = wrapper.find('.smy-checkbox__label')
  label.trigger('click')
  expect(wrapper.emitted('input')).toBeFalsy()

  await wrapper.setProps({
    labelDisabled: false,
  })
  await label.trigger('click')
  expect(wrapper.emitted('input')).toBeTruthy()
})

test('should adjust label position when using label-position prop', () => {
  const wrapper = mount(Checkbox, {
    propsData: {
      labelPosition: 'left',
    },
    slots: {
      default: 'label',
    },
  })
  expect(wrapper.html()).toMatchSnapshot()
})
test('should emit click event when checkbox icon is clicked', async () => {
  const onClick = jest.fn()
  const wrapper = mount(Checkbox, {
    listeners: {
      click: onClick,
    },
  })
  wrapper.trigger('click')
  expect(onClick).toHaveBeenCalledTimes(1)

  const icon = wrapper.find('.smy-checkbox__icon')
  icon.trigger('click')
  expect(onClick).toHaveBeenCalledTimes(2)
})

test('should render icon & label slot correctly', async () => {
  const wrapper = mount(Checkbox, {
    scopedSlots: {
      icon: ({ checked, disabled }) => `checked: ${checked}, disabled: ${disabled}`,
    },
    slots: {
      default: 'Custom label',
    },
  })
  expect(wrapper.html()).toMatchSnapshot()
})

test('should render label slot correctly', async () => {
  const slot = jest.fn()
  const wrapper = mount(Checkbox, {
    scopedSlots: {
      default: slot,
    },
  })
  expect(slot.mock.calls[0]).toEqual([{ checked: false, disabled: false }])

  await wrapper.setProps({ checked: true })
  expect(slot.mock.calls[1]).toEqual([{ checked: true, disabled: false }])

  await wrapper.setProps({ disabled: true })
  expect(slot.mock.calls[2]).toEqual([{ checked: true, disabled: true }])
})
