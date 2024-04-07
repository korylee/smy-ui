import { mount } from '@vue/test-utils'
import Radio from '..'

test('should emit "input" event when radio icon or label is clicked', async () => {
  const wrapper = mount(Radio, {
    slots: {
      default: 'Label',
    },
  })
  const icon = wrapper.find('.smy-radio__icon')
  const label = wrapper.find('.smy-radio__label')
  icon.trigger('click')
  expect(wrapper.emitted('input')).toBeTruthy()

  label.trigger('click')
  expect(wrapper.emitted('input')).toBeTruthy()
})

test('should not emit "input" event when radio icon is disabled and clicked', () => {
  const wrapper = mount(Radio, {
    attrs: {
      disabled: true,
    },
  })
  const icon = wrapper.find('.smy-radio__icon')
  icon.trigger('click')
  expect(wrapper.emitted('input')).toBeFalsy()
})

test('should render "smy-radio--label-disabled" class and not emit "input" event when using label-disabled prop', () => {
  const wrapper = mount(Radio, {
    attrs: {
      labelDisabled: true,
    },
    slots: {
      default: 'Label',
    },
  })
  expect(wrapper.classes()).toContain('smy-radio--label-disabled')
  const label = wrapper.find('.smy-radio__label')
  label.trigger('click')
  expect(wrapper.emitted('input')).toBeFalsy()
})

test('should adjust label position when using label-position prop', () => {
  const wrapper = mount(Radio, {
    attrs: { labelPosition: 'left' },
    slots: {
      default: 'Label',
    },
  })
  const label = wrapper.find('.smy-radio__label')
  expect(label.classes()).toContain('smy-radio__label--left')
})

test('should emit click event when radio icon is clicked', () => {
  const onClick = jest.fn()
  const wrapper = mount(Radio, {
    listeners: {
      click: onClick,
    },
  })
  wrapper.trigger('click')
  expect(onClick).toHaveBeenCalledTimes(1)

  const icon = wrapper.find('.smy-radio__icon')
  icon.trigger('click')
  expect(onClick).toHaveBeenCalledTimes(2)
})
