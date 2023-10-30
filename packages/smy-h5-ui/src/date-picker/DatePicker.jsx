import Picker from '../picker'
import { props } from './props'
import { createNamespace } from '../_utils/vue/create'
import { range, padZero, pick, assign, genArray, isSameValue } from '../_utils/shared'
import { getMonthEndDay } from './utils'
import { pickerSharedPropKeys } from '../picker/props'
import { getListeners } from '../_mixins/listeners'
import { pickerSharedListeners } from '../picker/utils'

import '../popup/popup.less'
import '../picker/picker.less'

const [name] = createNamespace('date-picker')

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
        if (isSameValue(param, oldParam)) return
        this.columns = this.genOptions(param)
      },
    },
  },
  methods: {
    getValue(type) {
      const { minDate, columnsType, currentValue } = this
      const index = columnsType.indexOf(type)
      const target = currentValue[index]
      if (target) {
        return +target
      }
      switch (type) {
        case 'year':
          return minDate.getFullYear()
        case 'month':
          return minDate.getMonth() + 1
        case 'day':
          return minDate.getDate()
      }
    },
    genParam(type) {
      const { maxDate, minDate } = this
      const minYear = minDate.getFullYear()
      const maxYear = maxDate.getFullYear()
      switch (type) {
        case 'year':
          return {
            type,
            min: minYear,
            max: maxYear,
          }
        case 'month': {
          const year = this.getValue('year')
          const minMonth = minYear === year ? minDate.getMonth() + 1 : 1
          const maxMonth = maxYear === year ? maxDate.getMonth() + 1 : 12
          return {
            type,
            min: minMonth,
            max: maxMonth,
          }
        }
        case 'day': {
          const year = this.getValue('year')
          const month = this.getValue('month')
          const minMonth = minDate.getMonth() + 1
          const maxMonth = maxDate.getMonth() + 1
          const minDay = year === minYear && month === minMonth ? minDate.getDate() : 1
          const maxDay = year === maxYear && month === maxMonth ? maxDate.getDate() : getMonthEndDay(year, month)
          return {
            type,
            min: minDay,
            max: maxDay,
          }
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

    const attrs = assign(pick(_vm.$props, pickerSharedPropKeys), {
      value: _vm.currentValue,
      columns: _vm.columns,
      'item-children': _vm.genChildren,
      'preset-value': _vm.genDefaultVal,
      cascade: '',
    })
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
