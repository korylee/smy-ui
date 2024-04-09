import Picker from '../picker'
import { TIME_PICKER_COLUMN_TYPE, props } from './props'
import { createNamespace } from '../_utils/vue/create'
import { range, pick, padZero, assign } from '@smy-h5/shared'
import { pickerSharedPropKeys } from '../picker/props'
import { getListeners } from '../_mixins/listeners'
import { looseEqual, pickerSharedListeners } from '../picker/utils'
import { genArray } from '../_utils/shared'

import '../popup/popup.less'
import '../picker/picker.less'

const [name] = createNamespace('time-picker')

export default {
  name,
  props,
  data: (vm) => ({ columns: [], currentValue: vm.value.slice() }),
  computed: {
    initialParam({ columnsType }) {
      return this.genParam(columnsType[0])
    },
  },
  watch: {
    initialParam: {
      immediate: true,
      handler(param, oldParam) {
        if (looseEqual(param, oldParam)) return
        this.columns = this.genOptions(param)
      },
    },
  },
  methods: {
    formatTime(time) {
      const { columnsType } = this
      const timeLimitArr = time.split(':')
      return TIME_PICKER_COLUMN_TYPE.map((type, i) => (columnsType.includes(type) ? timeLimitArr[i] : '00'))
    },
    genParam(type) {
      const { minTime, maxTime } = this
      let { minHour, maxHour, minMinute, maxMinute, minSecond, maxSecond } = this

      if (minTime || maxTime) {
        const { columnsType, currentValue } = this
        const fullTime = { hour: 0, minute: 0, second: 0 }
        columnsType.forEach((type, i) => {
          fullTime[type] = currentValue[i] ?? 0
        })
        const { hour, minute } = fullTime
        if (minTime) {
          const [minH, minM, minS] = this.formatTime(minTime)
          minHour = minH
          const overlimitHour = +hour <= +minHour
          minMinute = overlimitHour ? minM : '00'
          minSecond = overlimitHour && +minute <= +minMinute ? minS : '00'
        }
        if (maxTime) {
          const [maxH, maxM, maxS] = this.formatTime(maxTime)
          maxHour = maxH
          const overlimitHour = +hour >= +maxHour
          maxMinute = overlimitHour ? maxM : '59'
          maxSecond = overlimitHour && +minute >= +maxMinute ? maxS : '59'
        }
      }

      switch (type) {
        case 'hour':
          return { type, min: minHour, max: maxHour }
        case 'minute': {
          return { type, min: minMinute, max: maxMinute }
        }
        case 'second': {
          return { type, min: minSecond, max: maxSecond }
        }
        default:
          return
      }
    },
    genOptions(param) {
      if (!param) return []
      const { min, max, type } = param
      const { filter, formatter } = this

      const length = max - min + 1

      return genArray(
        length,
        (index) => {
          const value = padZero(min + index)
          return formatter({ text: value, value, type })
        },
        filter
      )
    },
    genDefaultVal({ column, columnIndex }) {
      const value = this.currentValue[columnIndex]
      const minValue = +column[0].value
      const maxValue = +column[column.length - 1].value
      return padZero(range(+value, minValue, maxValue))
    },
    genChildren(item) {
      if (item.children) {
        return item.children
      }
      const { columnsType } = this
      const index = columnsType.indexOf(item.type)
      const nextType = columnsType[index + 1]
      const param = this.genParam(nextType)
      const children = this.genOptions(param)
      this.$set(item, 'children', children)
      return children
    },
  },
  render() {
    const _vm = this
    const _h = _vm.$createElement
    const _c = _vm._self._c || _h
    const listeners = getListeners.call(_vm, pickerSharedListeners)

    const attrs = assign(
      {
        value: _vm.currentValue,
        columns: _vm.columns,
        'item-children': _vm.genChildren,
        'preset-value': _vm.genDefaultVal,
        cascade: '',
      },
      pick(_vm.$props, pickerSharedPropKeys)
    )
    const scopedSlots = assign({}, _vm.$scopedSlots)

    const data = _vm._g(
      {
        attrs,
        on: {
          'update:value': function updateValue($event) {
            _vm.currentValue = $event
          },
        },
        scopedSlots,
      },
      listeners
    )
    return _c(Picker.Component, data)
  },
}
