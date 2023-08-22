import { resetScroll } from '../_utils/dom'
import { isObject } from '../_utils/is'
import { range } from '../_utils/shared'

/**
 * 字符串切割成数组
 * emoji表情占两个字符，用split时会被切割  例：'💛'.split('') -> ['\uD83D', '\uDC9B']
 * （T_T）es6这种写法 [...str]会被polyfill成 [].concat(str)
 * babel没办法分辨str是数组还是一个iterable对象，链接：https://babeljs.io/docs/assumptions#iterableisarray
 */
function stringToArray(str: string) {
  const arr: string[] = []
  for (const i of str) {
    arr.push(i)
  }
  return arr
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
