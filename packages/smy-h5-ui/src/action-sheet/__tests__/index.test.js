import ActionSheet from '..'
import { delay, trigger } from '../../../jest-utils'

test('test action-sheet functional show & close', async () => {
  const onOpen = jest.fn()
  const onOpened = jest.fn()
  const onClose = jest.fn()
  const onClosed = jest.fn()

  ActionSheet({
    items: [],
    onOpen,
    onOpened,
    onClose,
    onClosed,
  })

  await delay(16)
  expect(onOpen).toHaveBeenCalledTimes(1)
  await delay(300)
  expect(onOpened).toHaveBeenCalledTimes(1)
  expect(document.querySelector('.smy-popup').style.display).toBe('')

  ActionSheet.close()

  await delay(16)
  expect(onClose).toHaveBeenCalledTimes(1)
  await delay(300)
  expect(onClosed).toHaveBeenCalledTimes(1)
  expect(document.querySelector('.smy-popup')).toBeFalsy()
})

test('test action sheet functional onSelect', async () => {
  const onSelect = jest.fn()
  ActionSheet({
    items: [{ text: '选项一' }, { text: '选项二' }, { text: '选项三' }, { text: '选项四' }],
    onSelect,
  })
  await delay(16)
  await trigger(document.querySelector('.smy-action-sheet__item'), 'click')
  expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ text: '选项一' }), 0)

  await delay(30)
  ActionSheet.close()
})

test('action-sheet functional disabled', async () => {
  const onSelect = jest.fn()
  ActionSheet({
    items: [{ text: '选项一', disabled: true }, { text: '选项二' }],
    onSelect,
  })
  await delay(30)
  await trigger(document.querySelector('.smy-action-sheet__item'), 'click')
  expect(onSelect).toHaveBeenCalledTimes(0)

  await delay(30)
  ActionSheet.close()
})
