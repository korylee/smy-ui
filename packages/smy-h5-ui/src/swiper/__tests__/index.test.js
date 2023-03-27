import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Swiper from '..'
import { delay } from '../../../jest-utils'
import SwiperItem from '../../swiper-item'

const Wrapper = {
  components: { [Swiper.name]: Swiper, [SwiperItem.name]: SwiperItem },
  props: ['loop', 'autoplay', 'indicator'],
  template: `
<smy-swiper
  ref="swiper"
  style="width: 100px; height: 100px"
  v-bind="$props"
  v-on="$listeners"
>
  <smy-swiper-item>1</smy-swiper-item>
  <smy-swiper-item>2</smy-swiper-item>
  <smy-swiper-item>3</smy-swiper-item>
</smy-swiper>`,
}

test('test swiper & swiper-item use', () => {
  Vue.use(Swiper).use(SwiperItem)
  expect(Vue.component(Swiper.name)).toBeTruthy()
  expect(Vue.component(SwiperItem.name)).toBeTruthy()
})

test('test swiper next & prev & to method', async () => {
  const onChange = jest.fn()
  const wrapper = mount(Wrapper, {
    listeners: { change: onChange },
    propsData: { indicator: true },
  })
  const expectIndicatorIndex = (index) =>
    expect(
      wrapper.findAll('.smy-swiper__indicator-item').wrappers[index].classes('smy-swiper__indicator-item--active')
    ).toBe(true)
  await delay(50)
  const {
    swiper: { to, next, prev },
  } = wrapper.vm.$refs

  to(0)
  await delay(100)
  expect(onChange).toHaveBeenCalledTimes(0)
  expectIndicatorIndex(0)
  expect(wrapper.html()).toMatchSnapshot()

  next()
  await delay(100)
  expect(onChange).toHaveBeenLastCalledWith(1)
  expect(wrapper.html()).toMatchSnapshot()
  expectIndicatorIndex(1)

  prev()
  await delay(100)
  expect(onChange).toHaveBeenLastCalledWith(0)
  expect(wrapper.html()).toMatchSnapshot()
  expectIndicatorIndex(0)

  to(2)
  await delay(100)
  expect(onChange).toHaveBeenLastCalledWith(2)
  expectIndicatorIndex(2)
  expect(wrapper.html()).toMatchSnapshot()

  wrapper.destroy()
})
