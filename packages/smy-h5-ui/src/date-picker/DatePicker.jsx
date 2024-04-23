import Picker from '../picker'
import { props } from './props'
import { createNamespace } from '../_utils/vue/create'
import { isSameValue, genArray } from '../_utils/shared'
import { range, pick, padZero, assign, assignWith } from '@smy-h5/shared'
import { getMonthEndDay } from './utils'
import { pickerSharedPropKeys } from '../picker/props'
import { pickerSharedListeners } from '../picker/utils'
import { defineComponent, h, ref, set, unref, watch } from 'vue'

import '../popup/popup.less'
import '../picker/picker.less'
import { getListeners } from '../_utils/vue/listener'

const [name] = createNamespace('date-picker')

export default defineComponent({
  name,
  props,
  setup(props, { slots }) {
    const columns = ref([])
    const currentValue = ref(props.value.slice())

    watch(
      () => genParam(props.columnsType[0]),
      (val, oldVal) => {
        if (isSameValue(val, oldVal)) return
        columns.value = genOptions(val)
      },
      { immediate: true },
    )

    function getValue(type) {
      const { minDate } = props
      const index = props.columnsType.indexOf(type)
      const target = unref(currentValue)[index]
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
    }
    function genParam(type) {
      const { maxDate, minDate } = props
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
          const year = getValue('year')
          const minMonth = minYear === year ? minDate.getMonth() + 1 : 1
          const maxMonth = maxYear === year ? maxDate.getMonth() + 1 : 12
          return {
            type,
            min: minMonth,
            max: maxMonth,
          }
        }
        case 'day': {
          const year = getValue('year')
          const month = getValue('month')
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
    }
    function genOptions(param) {
      if (!param) return []
      const { min, max, type } = param

      const length = max - min + 1
      return genArray(
        length,
        (index) => {
          const value = padZero(min + index)
          return props.formatter({ text: value, value, type })
        },
        props.filter,
      )
    }
    function genDefaultVal({ column, columnIndex }) {
      const value = unref(currentValue)[columnIndex]
      const minValue = +column[0].value
      const maxValue = +column[column.length - 1].value
      return padZero(range(+value, minValue, maxValue))
    }
    function genChildren(item) {
      if (item.children) {
        return item.children
      }
      const { columnsType } = props
      const index = columnsType.indexOf(item.type)
      const nextType = columnsType[index + 1]
      const param = genParam(nextType)
      const children = genOptions(param)
      set(item, 'children', children)
      return children
    }

    return () => {
      const listeners = getListeners(pickerSharedListeners)

      const attrs = assign(pick(props, pickerSharedPropKeys), {
        value: unref(currentValue),
        columns: unref(columns),
        'item-children': genChildren,
        'preset-value': genDefaultVal,
        cascade: '',
      })
      const scopedSlots = assign({}, slots)

      const on = assignWith(
        {
          'update:value': ($event) => {
            currentValue.value = $event
          },
        },
        listeners,
        (targetVal, sourceVal) => (targetVal ? [targetVal].concat(sourceVal) : sourceVal),
      )
      const data = { attrs, on, scopedSlots }
      return h(Picker.Component, data)
    }
  },
})
