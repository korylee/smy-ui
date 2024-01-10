import Vue from 'vue'
import ImagePreview from '..'
import { delay, mockConsole, trigger, triggerDrag } from '../../../jest-utils'

test('test image-preview plugin', () => {
  const reset = mockConsole('info')
  Vue.use(ImagePreview)
  expect(Vue.component(ImagePreview.Component.name)).toBeTruthy()
  reset()
})

test('test image preview functional show & close', async () => {
  const reset = mockConsole('info')
  const onOpen = jest.fn()
  const onOpened = jest.fn()
  const onClose = jest.fn()
  const onClosed = jest.fn()

  ImagePreview({
    onOpen,
    onOpened,
    onClose,
    onClosed,
  })

  await delay(20)
  expect(onOpen).toHaveBeenCalledTimes(1)
  await delay(300)
  expect(onOpened).toHaveBeenCalledTimes(1)
  expect(document.querySelector('.smy-popup').style.display).toBe('')

  ImagePreview.close()

  await delay(20)
  expect(onClose).toHaveBeenCalledTimes(1)
  await delay(300)
  expect(onClosed).toHaveBeenCalledTimes(1)
  expect(document.querySelector('.smy-popup')).toBeFalsy()
  reset()
})

test('test image-preview onChange callback', async () => {
  const reset = mockConsole('info')
  const onChange = jest.fn()
  ImagePreview({
    images: ['https://korylee.github.io/blog/avatar.png', 'https://korylee.github.io/blog/avatar.png'],
    onChange,
  })
  await delay(200)

  const track = document.querySelector('.smy-swiper__track')
  await triggerDrag(track, -100, 0)
  expect(onChange).toHaveBeenLastCalledWith(1)

  await triggerDrag(track, 100, 0)
  expect(onChange).toHaveBeenLastCalledWith(0)

  ImagePreview.close()
  reset()
})

test('test image-preview closeable', async () => {
  const reset = mockConsole('info')
  ImagePreview({ closeable: true })
  await delay(200)
  await trigger(document.querySelector('.smy-image-preview__close-icon'), 'click')
  await delay(300)
  expect(document.querySelector('.smy-popup')).toBeFalsy()
  ImagePreview.close()
  reset()
})
