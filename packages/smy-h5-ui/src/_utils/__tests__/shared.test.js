import { delay } from '../../../jest-utils'
import { throttle, merge } from '../shared'

describe('throttle function', () => {
  it('当前无执行时，应该立即调用函数并执行一次', () => {
    const fn = jest.fn()
    const throttleFn = throttle(fn, 1000)

    throttleFn()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('在节流时间范围内多次调用函数，应该只执行一次，直到超过节流时间后再执行下一次', async () => {
    const fn = jest.fn()
    const throttledFn = throttle(fn, 1000)

    throttledFn()
    throttledFn()
    throttledFn()

    expect(fn).toHaveBeenCalledTimes(1)

    await delay(500)
    throttledFn()

    expect(fn).toHaveBeenCalledTimes(1)
    await delay(500)

    throttledFn()

    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('节流函数应该把参数传递给被节流的函数', () => {
    const fn = jest.fn()
    const throttleFn = throttle(fn, 1000)
    throttleFn('foo', 'bar')

    expect(fn).toHaveBeenCalledWith('foo', 'bar')
  })
})

describe('merge function', () => {
  it('合并两个对象', () => {
    const obj1 = { a: 1, b: { c: 2, d: 3 } }
    const obj2 = { b: { c: 4, e: 5 }, f: 6 }
    const expected = { a: 1, b: { c: 4, d: 3, e: 5 }, f: 6 }
    expect(merge(obj1, obj2)).toEqual(expected)
  })

  it('只传递一个对象', () => {
    const obj1 = { a: 1, b: { c: 2, d: 3 } }
    expect(merge(obj1)).toEqual(obj1)
  })

  it('不应修改合并项的对象', () => {
    const obj1 = { a: 1, b: { c: 2, d: 3 } }
    const obj2 = { b: { c: 4, e: 5 }, f: 6 }
    merge({}, obj1, obj2)
    expect(obj1).toEqual({ a: 1, b: { c: 2, d: 3 } })
    expect(obj2).toEqual({ b: { c: 4, e: 5 }, f: 6 })
  })
})
