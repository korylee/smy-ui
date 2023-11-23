import { delay } from '../../../jest-utils'
import { throttle, assign, genArray, decimal } from '../shared'

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

describe('assign function', () => {
  it('合并两个对象', () => {
    const obj1 = { a: 1, b: { c: 2, d: 3 } }
    const obj2 = { a: undefined, f: 6 }
    const expected = { a: undefined, b: { c: 2, d: 3 }, f: 6 }
    expect(assign(obj1, obj2, 5)).toEqual(expected)
  })

  it('只传递一个对象', () => {
    const obj1 = { a: 1, b: { c: 2, d: 3 } }
    expect(assign(obj1)).toEqual(obj1)
  })
})

describe('genArray', () => {
  it('should generate an array with the specified length', () => {
    const length = 5
    const mockGen = jest.fn((index) => index + 1)
    const result = genArray(length, mockGen)
    expect(result.length).toBe(length)
  })

  it('should generate an array with generated items', () => {
    const length = 5
    const mockGen = jest.fn((index) => index + 1)
    const result = genArray(length, mockGen)
    for (let i = 0; i < length; i++) {
      expect(result[i]).toBe(i + 1)
    }
  })

  it('should generate an array with filtered items if filter is provided', () => {
    const length = 5
    const mockGen = jest.fn((index) => (index % 2 === 0 ? index : null))
    const mockFilter = jest.fn((item) => item !== null)
    const result = genArray(length, mockGen, mockFilter)
    expect(result.length).toBe(3)
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBe(i * 2)
    }
  })
})

describe('decimal', () => {
  it('decimal add', () => {
    expect(decimal.add(0.1, 0.2)).toBe(0.3)
    expect(decimal.add(-0.1, -0.2)).toBe(-0.3)
    expect(decimal.add(0.1, 1)).toBe(1.1)
    expect(decimal.add(1, 2)).toBe(3)
    expect(decimal.subtract(0.1, 0.2)).toBe(-0.1)
    expect(decimal.multiply(0.1, 0.2)).toBe(0.02)
    expect(decimal.divide(0.1, 0.2)).toBe(0.5)
  })
})
