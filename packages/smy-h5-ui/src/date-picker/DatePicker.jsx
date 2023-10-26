import Picker from '../picker'
import { props } from './props'
import { createNamespace } from '../_utils/vue/create'
import { range, padZero, pick, assign } from '../_utils/shared'
import { getMonthEndDay } from './utils'
import { pickerSharedPropKeys } from '../picker/props'
import { getListeners } from '../_mixins/listeners'

import '../popup/popup.less'
import '../picker/picker.less'
import { pickerSharedListeners } from '../picker/utils'

const [name] = createNamespace('date-picker')

export default {
  name,
  props,
  data: (vm) => ({ columns: [], currentValue: vm.value.slice() }),
  computed: {
    initialColumns({ columnsType }) {
      return this.genChildren(columnsType[0])
    },
  },
  watch: {
    initialColumns: {
      immediate: true,
      handler(columns) {
        this.columns = columns.slice()
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
    genChildren(item) {
      const { columnsType } = this
      const { type } = item
      const index = columnsType.indexOf(type)
      const nextType = columnsType[index + 1]
      return this.genOptions(nextType)
    },
    genOptions(type) {
      const { maxDate, minDate, filter, formatter } = this
      const minYear = minDate.getFullYear()
      const maxYear = maxDate.getFullYear()
      let min
      let max
      if (type === 'year') {
        min = minYear
        max = maxYear
      } else if (type === 'month') {
        const year = this.getValue('year')
        const minMonth = minYear === year ? minDate.getMonth() + 1 : 1
        const maxMonth = maxYear === year ? maxDate.getMonth() + 1 : 12
        min = minMonth
        max = maxMonth
      } else if (type === 'day') {
        const year = this.getValue('year')
        const month = this.getValue('month')
        const minMonth = minDate.getMonth() + 1
        const maxMonth = maxDate.getMonth() + 1
        const minDay = year === minYear && month === minMonth ? minDate.getDate() : 1
        const maxDay = year === maxYear && month === maxMonth ? maxDate.getDate() : getMonthEndDay(year, month)
        min = minDay
        max = maxDay
      } else {
        return []
      }

      const length = max - min + 1

      const res = []
      for (let i = 0; i < length; i++) {
        const value = padZero(min + i)
        const item = formatter({ value, text: value, type })
        if (filter && !filter(item)) {
          continue
        }
        res.push(item)
      }
      return res
    },
    genDefaultVal({ column, columnIndex }) {
      const value = this.currentValue[columnIndex]
      const minValue = +column[0].value
      const maxValue = +column[column.length - 1].value
      return padZero(range(+value, minValue, maxValue))
    },
    addChildren(item) {
      if (item.children) {
        return item.children
      }
      const children = this.genChildren(item)
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
        'item-children': _vm.addChildren,
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
