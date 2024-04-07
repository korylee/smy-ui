import { mount } from '@vue/test-utils'
import NavBar from '..'
import { HAPTICS_FEEDBACK } from '../../_utils/contant'
import { delay, mockGetBoundingClientRect } from '../../../jest-utils'

test('should render left slot correctly', () => {
  const wrapper = mount(NavBar, {
    slots: {
      left: '<div class="custom-left">custom left</div>',
    },
  })
  expect(wrapper.find('.smy-nav-bar__left').html()).toMatchSnapshot()
  expect(wrapper.find('.smy-nav-bar__left').classes(HAPTICS_FEEDBACK)).toBeTruthy()
})

test('should render right slot correctly', () => {
  const wrapper = mount(NavBar, {
    slots: {
      right: '<div class="custom-right">custom right</div>',
    },
  })
  expect(wrapper.find('.smy-nav-bar__right').html()).toMatchSnapshot()
  expect(wrapper.find('.smy-nav-bar__right').classes(HAPTICS_FEEDBACK)).toBeTruthy()
})

test('should render title slot correctly', () => {
  const wrapper = mount(NavBar, {
    slots: {
      title: 'Custom Title',
    },
  })
  expect(wrapper.find('.smy-nav-bar__title').html()).toMatchSnapshot()
})

test('should emit click-right event when clicking right text', () => {
  const wrapper = mount(NavBar, {
    propsData: {
      rightText: 'Custom Right Text',
    },
  })
  wrapper.find('.smy-nav-bar__right').trigger('click')
  expect(wrapper.emitted('click-right')).toBeTruthy()
})

test('should emit click-left event when clicking left text', () => {
  const wrapper = mount(NavBar, {
    propsData: {
      leftText: 'Custom Left Text',
    },
  })
  wrapper.find('.smy-nav-bar__left').trigger('click')
  expect(wrapper.emitted('click-left')).toBeTruthy()
})

test('should render placeholder element when using placeholder prop', async () => {
  const restore = mockGetBoundingClientRect({ height: 100 })
  const wrapper = mount(NavBar, {
    propsData: {
      placeholder: true,
      fixed: true,
    },
  })
  await delay(0)
  expect(wrapper.html()).toMatchSnapshot()
  restore()
})

test('should render slots correctly when set clickable to false', () => {
  const wrapper = mount(NavBar, {
    propsData: {
      clickable: false,
    },
    scopedSlots: {
      left: () => 'Custom Left Text',
      right: () => 'Custom Right Text',
    },
  })
  const leftDom = wrapper.find('.smy-nav-bar__left')
  const rightDom = wrapper.find('.smy-nav-bar__right')
  expect(leftDom.html()).toMatchSnapshot()
  expect(rightDom.html()).toMatchSnapshot()
  expect(leftDom.classes(HAPTICS_FEEDBACK)).toBeFalsy()
  expect(rightDom.classes(HAPTICS_FEEDBACK)).toBeFalsy()
})
