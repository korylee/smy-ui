import Vue from 'vue'
import Picker from '..'
import { trigger, delay } from '../../../jest-utils'

test('test picker plugin', () => {
  Vue.use(Picker)
  expect(Vue.component(Picker.Component.name)).toBeTruthy()
})

const columns = [['A', 'B', 'C']]

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

  await Picker.close()
  expect(onClose).toHaveBeenCalledTimes(1)

  await delay(300)
  expect(document.querySelector('.smy-picker')).toBeFalsy()
  expect(onClosed).toHaveBeenCalledTimes(1)
})

test('test picker functional confirm', async () => {
  const onConfirm = jest.fn()

  Picker({
    columns,
    onConfirm,
  })
  await delay(300 + 16)

  await trigger(document.querySelector('.smy-picker__confirm-button'), 'click')
  expect(onConfirm).toHaveBeenCalledTimes(1)
})

test('test picker functional cancel', async () => {
  const onCancel = jest.fn()

  Picker({
    columns,
    onCancel,
  })
  await delay(300 + 16)

  await trigger(document.querySelector('.smy-picker__cancel-button'), 'click')
  expect(onCancel).toHaveBeenCalledTimes(1)
})

test('test picker functional textFormatter', async () => {
  const textFormatter = jest.fn().mockReturnValue('text')
  const onCancel = jest.fn()
  const columns = [['A']]

  Picker({
    columns,
    textFormatter,
    onCancel,
  })

  await delay(300 + 16)

  await trigger(document.querySelector('.smy-picker__cancel-button'), 'click')

  expect(textFormatter).toHaveBeenLastCalledWith('A', 0)
  expect(document.querySelector('.smy-picker__text').innerHTML).toBe('text')
})
