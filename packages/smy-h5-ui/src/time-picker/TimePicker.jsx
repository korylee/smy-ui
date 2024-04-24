import Picker from '../picker'
import { TIME_PICKER_COLUMN_TYPE, props } from './props'
import { createNamespace } from '../_utils/vue/create'
import { range, pick, padZero, assign, assignWith } from '@smy-h5/shared'
import { pickerSharedPropKeys } from '../picker/props'
import { looseEqual, pickerSharedListeners } from '../picker/utils'
import { genArray } from '../_utils/shared'
import { defineComponent, h, ref, set, unref, watch } from 'vue'
import { getListeners } from '../_utils/vue/listener'

import '../popup/popup.less'
import '../picker/picker.less'


const [name] = createNamespace('time-picker')

export default defineComponent({
  name,
  props,
  setup(props, { slots }) {
    const columns = ref([])
    const currentValue = ref(props.value.slice())

    watch(
      () => genParam(props.columnsType[0]),
      (val, oldVal) => {
        if (looseEqual(val, oldVal)) return
        columns.value = genOptions(props.columnsType[0])
      },
    )

    function formatTime(time) {
      const { columnsType } = props
      const timeLimitArr = time.split(':')
      return TIME_PICKER_COLUMN_TYPE.map((type, i) => (columnsType.includes(type) ? timeLimitArr[i] : '00'))
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
    function genParam(type) {
      const { minTime, maxTime } = props
      let { minHour, maxHour, minMinute, maxMinute, minSecond, maxSecond } = props

      if (minTime || maxTime) {
        const fullTime = { hour: 0, minute: 0, second: 0 }
        props.columnsType.forEach((type, i) => {
          fullTime[type] = unref(currentValue)[i] ?? 0
        })
        const { hour, minute } = fullTime
        if (minTime) {
          const [minH, minM, minS] = formatTime(minTime)
          minHour = minH
          const overlimitHour = +hour <= +minHour
          minMinute = overlimitHour ? minM : '00'
          minSecond = overlimitHour && +minute <= +minMinute ? minS : '00'
        }
        if (maxTime) {
          const [maxH, maxM, maxS] = formatTime(maxTime)
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
      const attrs = assign(
        {
          value: unref(currentValue),
          columns: unref(columns),
          'item-children': genChildren,
          'preset-value': genDefaultVal,
          cascade: '',
        },
        pick(props, pickerSharedPropKeys),
      )
      const listeners = getListeners(pickerSharedListeners)
      const on = assignWith(
        {
          'update:value': ($event) => {
            currentValue.value = $event
          },
        },
        listeners,
        (targetVal, sourceVal) => (targetVal ? [targetVal].concat(sourceVal) : sourceVal),
      )
      const data = {
        attrs,
        on,
        scopedSlots: slots,
      }
      return h(Picker.Component, data)
    }
  },
})
