import { mount } from '@vue/test-utils'
import Vue from 'vue'
import SmyPopup from '..'

test('test popup plugin', () => {
  Vue.use(SmyPopup)
  expect(Vue.component(SmyPopup.name)).toBeTruthy()
})

const Wrapper = {
  components: {
    SmyPopup,
  },
  data: () => ({ show: false }),
  template: `<smy-popup :show.sync="show" v-bind="$attrs">default slot content</smy-popup>`,
}

test('test popup show', async () => {
  const wrapper = mount(Wrapper)
  expect(wrapper.find('.smy-popup').isVisible()).toBeFalsy()
  expect(wrapper.html()).toMatchSnapshot()

  await wrapper.setData({ show: true })
  expect(wrapper.find('.smy-popup').isVisible()).toBeTruthy()
  expect(wrapper.html()).toMatchSnapshot()
  await wrapper.setData({ show: false })
  expect(wrapper.find('.smy-popup').isVisible()).toBeFalsy()
  expect(wrapper.html()).toMatchSnapshot()

  wrapper.destroy()
})

test('test popup z-index', async () => {
  const wrapper = mount(Wrapper)
  await wrapper.setData({ show: true })
  const prevPopupZIndex = window.getComputedStyle(wrapper.find('.smy-popup').element).zIndex
  const prevOverlayZIndex = window.getComputedStyle(wrapper.find('.smy-popup__overlay').element).zIndex

  await wrapper.setData({ show: false })
  await wrapper.setData({ show: true })

  expect(window.getComputedStyle(wrapper.find('.smy-popup').element).zIndex).toBe(String(+prevPopupZIndex + 3))
  expect(window.getComputedStyle(wrapper.find('.smy-popup__overlay').element).zIndex).toBe(
    String(+prevOverlayZIndex + 3)
  )

  wrapper.destroy()
})

test('test popup onOpen & onClose', async () => {
  const onOpen = jest.fn()
  const onClose = jest.fn()
  const Wrapper = {
    components: {
      SmyPopup,
    },
    data: () => ({ show: false }),
    methods: {
      onOpen,
      onClose,
    },
    template: `
      <smy-popup :show.sync="show" @open="onOpen" @close="onClose">defaul slot content</smy-popup>
    `,
  }
  const wrapper = mount(Wrapper)
  await wrapper.setData({ show: true })
  expect(onOpen).toHaveBeenCalledTimes(1)

  await wrapper.setData({ show: false })
  expect(onClose).toHaveBeenCalledTimes(1)

  wrapper.destroy()
})

test('tet popup close on clickOverlay', async () => {
  const onClose = jest.fn()
  const onClickOverlay = jest.fn()

  const Wrapper = {
    components: {
      SmyPopup,
    },
    data: () => ({ show: false, closeOnClickOverlay: true }),
    methods: {
      onClickOverlay,
      onClose,
    },
    template: `
      <smy-popup :show.sync="show" :closeOnClickOverlay="closeOnClickOverlay" @click-overlay="onClickOverlay" @close="onClose">
        defaul slot content
      </smy-popup>
    `,
  }
  const wrapper = mount(Wrapper)
  await wrapper.setData({ show: true })

  await wrapper.find('.smy-popup__overlay').trigger('click')
  expect(onClickOverlay).toHaveBeenCalledTimes(1)
  expect(onClose).toHaveBeenCalledTimes(1)

  await wrapper.setData({ closeOnClickOverlay: false, show: true })
  await wrapper.find('.smy-popup__overlay').trigger('click')
  expect(onClickOverlay).toHaveBeenCalledTimes(2)
  expect(onClose).toHaveBeenCalledTimes(1)

  wrapper.destroy()
})
