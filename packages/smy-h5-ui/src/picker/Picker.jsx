import SmyPopup from '../popup'
import { props, pickerToolbarPropKeys } from './props'
import { createGetPropertyFromItem } from '../_utils/shared'
import PickerColumn from './PickerColumn.vue'
import { isArray, isNil, toPxNum, pick, toNumber, wrapInArray, assign } from '@smy-h5/shared'
import { bem, name, looseEqual, pickerToolbarSlots, pickerPopupListeners, findIndexFromColumn } from './utils'
import { getListeners } from '../_mixins/listeners'
import { createChildrenMixin } from '../_mixins/relation'
import PickerToolbar from './PickerToolbar.vue'

import '../popup/popup.less'
import './picker.less'
import { popupSharedPropKeys } from '../popup/shared'
import { PICKER_KEY } from '../picker-group/shared'

let sid = 0

export default {
  name,
  components: { PickerColumn, SmyPopup, PickerToolbar },
  mixins: [createChildrenMixin(PICKER_KEY)],
  props,

  data: () => ({ pickedIndexes: [], pickedValues: [], pickedColumn: [], scrollColumns: [] }),

  computed: {
    localOptionHeight({ optionHeight }) {
      return toPxNum(optionHeight)
    },
    center({ columnHeight, localOptionHeight }) {
      return (columnHeight - localOptionHeight) / 2
    },
    columnHeight({ optionCount, localOptionHeight }) {
      return toNumber(optionCount) * localOptionHeight
    },
    getText: (vm) => createGetPropertyFromItem(vm.itemText),
    getValue: (vm) => createGetPropertyFromItem(vm.itemValue),
    getChildren: (vm) => createGetPropertyFromItem(vm.itemChildren),
    getDisabled: (vm) => createGetPropertyFromItem(vm.itemDisabled, false),
  },

  watch: {
    value(val, oldVal) {
      if (this.initing) return
      if (looseEqual(val, oldVal) || looseEqual(val, this.pickedValues)) {
        return
      }
      const { scrollColumns } = this
      val?.forEach((item, index) => {
        const changed = item !== oldVal?.[index]
        const scrollColumn = scrollColumns[index]
        changed && scrollColumn && this.updatePicked(scrollColumn)
      })
    },
    columns: {
      immediate: true,
      handler(val, oldVal) {
        if (looseEqual(val, oldVal)) return
        this.init()
      },
    },
  },

  methods: {
    genEventParams() {
      const { pickedIndexes, pickedValues, pickedColumn } = this
      return {
        values: pickedValues.slice(),
        indexes: pickedIndexes,
        column: pickedColumn,
      }
    },
    confirm() {
      this.stopScroll()
      const params = this.genEventParams()
      this.$emit('confirm', params)
      this.$emit('input', params.values)
      return params
    },

    cancel() {
      this.stopScroll()
      const params = this.genEventParams()

      this.$emit('cancel', params)
    },

    init() {
      const { columns } = this
      this.initing = true
      this.pickedIndexes = []
      this.pickedValues = []
      this.pickedColumn = []
      this.scrollColumns = this.cascade ? this.initCascade(columns) : this.initNormal(columns)
      this.initing = false
    },

    initNormal(columns) {
      return columns.map(this.createScrollColumn)
    },

    initCascade(columns) {
      const scrollColumns = []
      this.setChildren(scrollColumns, 0, columns)
      return scrollColumns
    },

    setChildren(scrollColumns, columnIndex, children) {
      if (!isArray(children) || !children.length) return
      const scrollColumn = this.createScrollColumn(children, columnIndex, children)
      const { pickedIndex } = scrollColumn
      this.$set(scrollColumns, columnIndex, scrollColumn)
      const nextColumnIndex = columnIndex + 1
      this.setChildren(scrollColumns, nextColumnIndex, this.getChildren(children[pickedIndex], scrollColumn))
    },

    updatePicked(scrollColumn) {
      const { value, pickedIndexes, pickedValues, presetValue, pickedColumn } = this
      const { column, columnIndex, pickedIndex: oldPickedIndex } = scrollColumn
      const pickedValue = wrapInArray(value)[columnIndex]
      const values = column.map((item) => this.getValue(item, scrollColumn))
      let findedIndex = -1
      if (!isNil(pickedValue)) {
        findedIndex = values.indexOf(pickedValue)
      }
      if (findedIndex === -1) {
        if (presetValue) {
          const defaultValue = presetValue(scrollColumn)
          isNil(defaultValue) || (findedIndex = values.indexOf(defaultValue))
        } else if (!isNil(oldPickedIndex)) {
          findedIndex = oldPickedIndex
        }
      }
      const pickedIndex = findIndexFromColumn(findedIndex, scrollColumn, this.getDisabled)
      if (!isNil(pickedIndexes[columnIndex]) && oldPickedIndex === pickedIndex) return
      pickedColumn[columnIndex] = column[pickedIndex]
      pickedIndexes[columnIndex] = pickedIndex
      pickedValues[columnIndex] = values[pickedIndex]
      scrollColumn.pickedIndex = pickedIndex
    },

    createScrollColumn(column, columnIndex, columns) {
      let scrollColumn = column.$_scrollColumn
      if (!scrollColumn) {
        scrollColumn = {
          id: sid++,
          column,
          columnIndex,
          columns,
        }
        Object.defineProperty(column, '$_scrollColumn', {
          value: scrollColumn,
          enumerable: false,
          writable: false,
          configurable: false,
        })
      }
      this.updatePicked(scrollColumn)
      return scrollColumn
    },

    onScrollInto(index) {
      const { scrollColumns, pickedIndexes, pickedValues, pickedColumn } = this
      const scrollColumn = scrollColumns[index]
      const { pickedIndex, column } = scrollColumn
      pickedIndexes[index] = pickedIndex
      pickedColumn[index] = column[pickedIndex]
      pickedValues[index] = this.getValue(column[pickedIndex], scrollColumn)
      this.$emit('update:value', pickedValues.slice())
      this.$emit('scroll-into', scrollColumn)
    },

    rebuildChild(scrollColumn) {
      const { scrollColumns } = this
      const { columns, columnIndex, pickedIndex } = scrollColumn
      const nextColumnIndex = columnIndex + 1
      const column = columns[pickedIndex]
      const children = this.getChildren(column, scrollColumn)
      this.setChildren(scrollColumns, nextColumnIndex, children)
    },

    stopScroll() {
      const { columnRefs } = this.$refs
      columnRefs.forEach((columnRef) => {
        if (!columnRef?.scrolling) return
        columnRef.stopScroll()
        const { scrollColumn } = columnRef
        this.change(scrollColumn)
      })
    },

    change(scrollColumn) {
      const {
        $refs: { columnRefs },
        cascade,
      } = this
      cascade && this.rebuildChild(scrollColumn)
      const hasScrolling = columnRefs.some((columnRef) => columnRef.scrolling)
      if (hasScrolling) return
      const params = this.genEventParams()

      this.$emit('change', params)
    },
  },

  render() {
    /**@type {import('vue').default} */
    const vm = this
    const _h = vm.$createElement
    const c = vm._self._c || _h
    const {
      popup,
      [PICKER_KEY]: pickerGroup,
      toolbar,
      columnHeight,
      scrollColumns,
      localOptionHeight,
      center,
      allowHtml,
      // method
      confirm,
      cancel,
      getText,
      change,
      onScrollInto,
      getDisabled,
    } = vm

    const renderToolbar = () => {
      if (toolbar && !pickerGroup) {
        const fallback = () => {
          const fns = pickerToolbarSlots.map((key) => ({
            key: key,
            fn: () => [vm._t(key)],
            proxy: true,
          }))
          return [
            c(PickerToolbar, {
              on: { confirm, cancel },
              attrs: pick(vm.$props, pickerToolbarPropKeys),
              scopedSlots: vm._u(fns, null, true),
            }),
          ]
        }
        return vm._t('toolbar', fallback)
      }
      return vm._e()
    }

    const renderBody = () => {
      const domPropName = allowHtml ? 'innerHTML' : 'textContent'

      return (
        <div class={bem('columns')} style={{ height: `${columnHeight}px` }}>
          {scrollColumns.map((scrollColumn, index) => {
            const scopedSlots = vm._u([
              {
                key: 'item',
                fn({ item, index }) {
                  const itemFallback = () => [
                    c('div', { class: bem('text'), domProps: { [domPropName]: vm._s(getText(item, scrollColumn)) } }),
                  ]
                  return [vm._t('item', itemFallback, { item, index })]
                },
              },
            ])
            const attrs = {
              scrollColumn,
              center,
              height: localOptionHeight,
              getDisabled,
            }
            return c(PickerColumn, {
              ref: 'columnRefs',
              refInFor: true,
              key: scrollColumn.id,
              attrs,
              on: {
                change: () => change(scrollColumn),
                'scroll-into': () => onScrollInto(index),
              },
              scopedSlots,
            })
          })}
          <div class={bem('picked')} style={{ top: `${center}px`, height: `${localOptionHeight}px` }} />
          <div class={bem('mask')} style={{ backgroundSize: `100% ${center}px` }} />
        </div>
      )
    }

    const children = [renderToolbar(), vm._t('top'), renderBody()]

    if (popup && !pickerGroup) {
      const attrs = assign(
        {
          contentClass: bem(),
          wrapperClass: bem('popup'),
          'smy-picker-cover': '',
          position: 'bottom',
        },
        pick(vm.$props, popupSharedPropKeys),
      )
      return c(SmyPopup, { attrs, on: getListeners.call(vm, pickerPopupListeners) }, children, 2)
    }

    return c('div', { class: bem() }, children, 2)
  },
}
