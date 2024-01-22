import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Countdown from '..'
import { delay } from '../../../jest-utils'

test('test countdown plugin', () => {
  Vue.use(Countdown)
  expect(Vue.component(Countdown.name)).toBeTruthy()
})

describe('test countdown props', () => {
  test('test format prop', () => {
    const wrapper = mount(Countdown, {
      propsData: {
        time: 108000000,
        format: 'HH-mm-ss-SS',
      },
    })
    const reg = /(\d{2}-){3}\d{2}/
    expect(reg.test(wrapper.text())).toBe(true)
    wrapper.destroy()
  })
  test('test countdown auto-start prop', async () => {
    const wrapper = mount(Countdown, {
      propsData: {
        time: 10800,
        autoStart: false,
      },
    })

    const text = wrapper.text()

    await delay(100)

    expect(wrapper.text()).toBe(text)
    wrapper.destroy()
  })
})

describe('test countdown events', () => {
  test('test countdown onEnd and onChange', async () => {
    const onEnd = jest.fn()
    const onChange = jest.fn()

    const wrapper = mount(Countdown, {
      propsData: {
        time: 1000,
        autoStart: true,
      },
      listeners: {
        end: onEnd,
        change: onChange,
      },
    })

    await delay(1100)

    expect(onEnd).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalled()
    wrapper.destroy()
  })

  test('test onChange event argument', async () => {
    const onChange = jest.fn()
    const wrapper = mount(Countdown, {
      listeners: {
        change: onChange,
      },
      propsData: { time: 1, autoStart: true, millisecond: true },
    })
    await delay(50)

    expect(onChange.mock.calls[0][0]).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 1,
      total: 1,
    })

    wrapper.destroy()
  })
})

test('test start, payse ant reset methods', async () => {
  const template = `<smy-countdown :time="time" ref="countdown" :auto-start="false"></smy-countdown>`
  const wrapper = mount({
    template,
    components: { SmyCountdown: Countdown },
    data: () => ({ time: 108000 }),
  })
  const text = wrapper.text()

  await delay(100)
  expect(wrapper.text()).toBe(text)
  wrapper.vm.$refs.countdown.start()
  await delay(100)
  expect(wrapper.text()).not.toBe(text)

  wrapper.vm.$refs.countdown.pause()
  const pauseText = wrapper.text()
  await delay(100)
  expect(wrapper.text()).toBe(pauseText)

  wrapper.vm.$refs.countdown.reset()
  await delay(500)
  expect(wrapper.text()).toBe(text)

  wrapper.destroy()
})
