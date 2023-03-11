import Vue from 'vue'
import Picker from '..'

test('test picker plugin', () => {
  Vue.use(Picker)
  expect(Vue.component(Picker.Component.name)).toBeTruthy()
})

const columns = [['A', 'B', 'C']]

export const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))

test('test picker functional show & close', async () => {
  const onOpen = jest.fn()
  const onOpened = jest.fn()
  const onClose = jest.fn()
  const onClosed = jest.fn()
  Picker({
    columns,
    onOpen,
    onOpened,
    onClose,
    onClosed,
  })
  await delay(16)
  expect(onOpen).toHaveBeenCalledTimes(1)
  expect(document.querySelector('.smy-popup').style.display).toBe('')

  await delay(300)
  expect(onOpened).toHaveBeenCalledTimes(1)

  Picker.close()
  await delay(16)
  expect(onClose).toHaveBeenCalledTimes(1)
})
