import { resetScroll } from '../_utils/dom'
import { isObject } from '../_utils/is'
import { range } from '../_utils/shared'

/**
 * 字符串切割成数组
 * emoji表情占两个字符，用split时会被切割  例：'💛'.split('') -> ['\uD83D', '\uDC9B']
 * （T_T）es5无法处理emoji, es6这种写法 [...str]会被polyfill成 [].concat(str) --- babel（宽松模式）没办法分辨str是数组还是一个iterable对象，链接：https://babeljs.io/docs/assumptions#iterableisarray。除非关闭宽松模式，但会打包出特别多的东西
 */
export function stringToArray(str: string) {
  return Array.from ? Array.from(str) : str.split('')
}

export const getStringLength = (str: string) => stringToArray(str).length

export const cutString = (str: string, maxlength: number) => stringToArray(str).slice(0, maxlength).join('')

export type FieldAutosize = {
  maxHeight?: number
  minHeight?: number
}

export function resizeTextarea(input: HTMLInputElement, autosize: true | FieldAutosize) {
  const { style: inputStyle } = input
  const preHeight = inputStyle.height
  const preScrollHeight = input.scrollHeight
  inputStyle.height = 'auto'
  let height = input.scrollHeight

  if (isObject(autosize)) {
    const { maxHeight = height, minHeight = height } = autosize
    height = range(height, minHeight, maxHeight)
  }
  if (!height) return
  const unneed = height === preScrollHeight && height === +preHeight.replace('px', '')

  if (unneed) {
    inputStyle.height = preHeight
    return
  }

  inputStyle.height = `${height}px`
  resetScroll(true)
}

export function mapInputType(type: string) {
  if (type === 'textarea') {
    return
  }

  if (type === 'number') {
    return {
      type: 'text',
      inputmode: 'decimal',
    }
  }
  if (type === 'digit') {
    return {
      type: 'tel',
      inputmode: 'numeric',
    }
  }
  return { type }
}
