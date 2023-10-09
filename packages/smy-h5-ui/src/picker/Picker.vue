<template>
  <maybe-popup
    :show.sync="internalShow"
    :maybe="popup"
    :teleport="teleport"
    :close-on-click-overlay="closeOnClickOverlay"
    :content-class="bem()"
    :wrapper-class="bem('popup')"
    smy-picker-cover
    position="bottom"
    v-on="popupListeners"
    v-bind="$attrs"
  >
    <slot name="toolbar">
      <div :class="bem('toolbar')">
        <slot name="cancel">
          <span :class="bem('cancel-button')" smy-picker-cover @click="cancel">{{ cancelButtonText }}</span>
        </slot>
        <slot name="title">
          <div :class="bem('title')">{{ title }}</div>
        </slot>
        <slot name="confirm">
          <span :class="bem('confirm-button')" smy-picker-cover @click="confirm">{{ confirmButtonText }}</span>
        </slot>
      </div>
    </slot>
    <slot name="top"></slot>
    <div :class="bem('columns')" :style="{ height: `${columnHeight}px` }">
      <picker-column
        v-for="scrollColumn in scrollColumns"
        ref="columnRefs"
        :key="scrollColumn.id"
        :column="scrollColumn.column"
        :column-index="scrollColumn.columnIndex"
        :picked-index.sync="scrollColumn.pickedIndex"
        :center="center"
        :height="localOptionHeight"
        @change="change(scrollColumn)"
      >
        <template #item="{ item, index }">
          <slot name="option" :option="item" :option-index="index" v-bind="scrollColumn">
            <div v-if="allowHtml" :class="bem('text')" v-html="getText(item, index)"></div>
            <div v-else :class="bem('text')" v-text="getText(item, index)"></div>
          </slot>
        </template>
      </picker-column>
      <div
        :class="bem('picked')"
        :style="{
          top: `${center}px`,
          height: `${localOptionHeight}px`,
        }"
      ></div>
      <div :class="bem('mask')" :style="{ backgroundSize: `100% ${center}px` }"></div>
    </div>
  </maybe-popup>
</template>

<script>
import SmyPopup from '../popup'
import { props } from './props'
import { createProxiedModel } from '../_mixins/proxiedModel'
import { toPxNum } from '../_utils/dom'
import { createGetPropertyFromItem, toNumber, wrapInArray } from '../_utils/shared'
import PickerColumn from './PickerColumn.vue'
import { isArray, isNil } from '../_utils/is'
import { createMaybeComponent } from '../_utils/vue/component'
import { bem, getListeners, name, listEqual } from './utils'

let sid = 0

const MaybePopup = createMaybeComponent(SmyPopup)

export default {
  name,
  components: { MaybePopup, PickerColumn },
  inheritAttrs: false,
  mixins: [createProxiedModel('show', 'internalShow', { passive: false, event: 'update:show' })],
  props,

  data: () => ({ pickedIndexes: [], scrollColumns: [] }),

  computed: {
    popupListeners: (vm) => getListeners(vm, ['click-overlay', 'open', 'opened', 'close', 'closed', 'route-change']),
    localOptionHeight({ optionHeight }) {
      return toPxNum(optionHeight)
    },
    center({ columnHeight, localOptionHeight }) {
      return (columnHeight - localOptionHeight) / 2
    },
    columnHeight({ optionCount, localOptionHeight }) {
      return toNumber(optionCount) * localOptionHeight
    },
    getText: (vm) => createGetPropertyFromItem(vm.textFormatter),
    getValue: (vm) => createGetPropertyFromItem(vm.valueFormatter),
    getChildren: (vm) => createGetPropertyFromItem(vm.childrenFormatter),
  },

  watch: {
    value: 'init',
    columns: {
      immediate: true,
      handler(val, oldVal) {
        if (listEqual(val, oldVal)) return
        this.init()
      },
    },
  },

  methods: {
    bem,
    confirm() {
      this.stopScroll()

      const { values, indexes } = this.getPicked()
      this.pickedIndexes = indexes.slice()
      this.$emit('confirm', values, indexes)
      this.$emit('input', values)
    },

    cancel() {
      this.stopScroll()

      const { values, indexes } = this.getPicked()
      this.pickedIndexes = indexes.slice()
      this.$emit('cancel', values, indexes)
    },

    init() {
      this.scrollColumns = this.cascade ? this.initCascade() : this.initNormal()
      this.pickedIndexes = []
    },

    initNormal() {
      const { columns } = this
      return columns.map((column, columnIndex) => {
        return this.createScrollColumn(column, columnIndex)
      })
    },

    initCascade() {
      const scrollColumns = []
      this.setChildren(scrollColumns, 0, this.columns)
      return scrollColumns
    },

    setChildren(scrollColumns, columnIndex, children) {
      if (!isArray(children) || !children.length) return
      const scrollColumn = this.createScrollColumn(children, columnIndex, children)
      const { pickedIndex } = scrollColumn
      this.$set(scrollColumns, columnIndex, scrollColumn)
      const nextColumnIndex = columnIndex + 1
      this.setChildren(scrollColumns, nextColumnIndex, this.getChildren(children[pickedIndex], nextColumnIndex))
    },

    createScrollColumn(column, columnIndex, columns) {
      const { value, scrollColumns } = this
      const oldScrollColumn = scrollColumns[columnIndex]
      const pickedValue = wrapInArray(value)[columnIndex]
      const findIndex = isNil(pickedValue)
        ? -1
        : column.findIndex((item) => this.getValue(item, columnIndex) === pickedValue)
      const pickedIndex = findIndex === -1 ? 0 : findIndex
      const id = oldScrollColumn && oldScrollColumn.column === column ? oldScrollColumn.id : sid++
      return {
        id,
        column,
        columnIndex,
        pickedIndex,
        columns,
      }
    },

    rebuildChild(scrollColumn) {
      const { scrollColumns } = this
      const { columns, columnIndex, pickedIndex } = scrollColumn
      const nextColumnIndex = columnIndex + 1
      const children = this.getChildren(columns[pickedIndex], nextColumnIndex)
      this.setChildren(scrollColumns, nextColumnIndex, children)
    },

    stopScroll() {
      const { columnRefs } = this.$refs
      columnRefs.forEach((columnRef) => {
        if (!columnRef?.scrolling) return
        columnRef.stopScroll()
        const { columnIndex, index } = columnRef
        const scrollColumn = this.scrollColumns[columnIndex]
        scrollColumn.pickedIndex = index
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
      const { values, indexes } = this.getPicked()
      if (listEqual(indexes, this.pickedIndexes)) return
      this.pickedIndexes = indexes.slice()
      this.$emit('change', values, indexes)
    },

    getPicked() {
      const values = []
      const indexes = this.scrollColumns.map(({ pickedIndex, column, columnIndex }) => {
        values.push(this.getValue(column[pickedIndex], columnIndex))
        return pickedIndex
      })
      return { values, indexes }
    },
  },
}
</script>

<style lang="less">
@import '../popup/popup.less';
@import './picker.less';
</style>
