<template>
  <component
    :is="popup ? SmyPopup : Transition"
    v-bind="
      popup
        ? {
            closeOnClickOverlay,
            show,
            teleport,
            class: bem('popup'),
            position: 'bottom',
            onOpen,
            onClose,
            onOpened,
            onClosed,
            onRouteChange,
            onClickOverlay,
            'onUpdate:show': onUpdateShow,
          }
        : undefined
    "
    smy-picker-cover
  >
    <div :class="bem()" v-bind="$attrs">
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
          :key="scrollColumn.id"
          v-model:picked-index="scrollColumn.pickedIndex"
          :ref="(el: any) => setScrollInstance(scrollColumn, el)"
          :column="scrollColumn.column"
          :column-index="scrollColumn.columnIndex"
          :center="center"
          :height="localOptionHeight"
          @change="change(scrollColumn)"
        >
          <template #option="data">
            <slot name="option" v-bind="data">
              <div v-if="allowHtml" v-html="getItemText(data.option, data.index)" class="smy--ellipsis"></div>
              <div v-else v-text="getItemText(data.option, data.index)" class="smy--ellipsis"></div>
            </slot>
          </template>
        </picker-column>
        <div
          :style="{
            top: `${center}px`,
            height: `${localOptionHeight}px`,
          }"
          :class="bem('picked')"
        ></div>
        <div :class="bem('mask')" :style="{ backgroundSize: `100% ${center}px` }"></div>
      </div>
    </div>
  </component>
</template>

<script lang="ts">
import SmyPopup from '../popup'
import { props, NormalColumn, CascadeColumn } from './props'
import { toPxNum } from '../_utils/dom'
import { createGetPropertyFromItem, toNumber, wrapInArray } from '../_utils/shared'
import PickerColumn from './PickerColumn.vue'
import { isArray, isNil } from '../_utils/is'
import { createNamespace } from '../_utils/vue/create'
import { ComponentPublicInstance, Ref, Transition, computed, defineComponent, ref, watch, nextTick } from 'vue'

let sid = 0

function isListEqual(listA?: any[], listB?: any[]) {
  if (listA === listB) return true
  if (!isArray(listA) || !isArray(listB)) return false
  if (listA.length !== listB.length) return false
  return listA.every((item, index) => item === listB[index])
}

type PickerColumnInstance = ComponentPublicInstance<typeof PickerColumn>

type ScrollColumn = {
  id: number
  columnIndex: number
  pickedIndex: number
  column: NormalColumn
  columns?: CascadeColumn[]
  columnInstance: PickerColumnInstance | null
}

const [name, bem] = createNamespace('picker')

export default defineComponent({
  name,
  components: { PickerColumn },
  inheritAttrs: false,
  props,
  emits: [
    'update:show',
    'clickOverlay',
    'open',
    'opened',
    'close',
    'closed',
    'routeChange',
    'update:modelValue',
    'cancel',
    'confirm',
    'change',
  ],
  setup(props, { expose, emit }) {
    let pickedIndexes: number[] = []
    const scrollColumns: Ref<ScrollColumn[]> = ref([])
    const localOptionHeight = computed(() => toPxNum(props.optionHeight))
    const columnHeight = computed(() => toNumber(props.optionCount) * localOptionHeight.value)
    const center = computed(() => (columnHeight.value - localOptionHeight.value) / 2)

    const getItemText = createGetPropertyFromItem(props.textFormatter)
    const getItemChildren = createGetPropertyFromItem(props.childrenFormatter)
    const getItemValue = createGetPropertyFromItem(props.valueFormatter)

    const createScrollColumn = (column: NormalColumn, columnIndex: number, columns?: CascadeColumn[]): ScrollColumn => {
      const oldScrollColumn = scrollColumns.value[columnIndex]
      const pickedValue = wrapInArray(props.modelValue)[columnIndex]
      const findIndex = isNil(pickedValue)
        ? -1
        : column.findIndex((item, index) => getItemValue(item, index) === pickedValue)
      const pickedIndex = findIndex === -1 ? 0 : findIndex
      const id = oldScrollColumn?.column === column ? oldScrollColumn.id : ++sid
      return {
        id,
        column,
        columnIndex,
        pickedIndex,
        columns,
        columnInstance: null,
      }
    }
    const setChildren = (scrollColumns: ScrollColumn[], columnIndex: number, children: CascadeColumn[]) => {
      if (!isArray(children) || !children.length) return
      const scrollColumn = createScrollColumn(children, columnIndex, children)
      const { pickedIndex } = scrollColumn
      scrollColumns[columnIndex] = scrollColumn
      const nextColumnIndex = columnIndex + 1
      setChildren(scrollColumns, nextColumnIndex, getItemChildren(children[pickedIndex], columnIndex))
    }
    const rebuildChild = (scrollColumn: ScrollColumn) => {
      const { columns, columnIndex, pickedIndex } = scrollColumn
      if (!columns) return
      const nextColumnIndex = columnIndex + 1
      const children = getItemChildren(columns[pickedIndex], columnIndex)
      setChildren(scrollColumns.value, nextColumnIndex, children)
    }
    const getPicked = () => {
      const values: any[] = []
      const indexes = scrollColumns.value.map(({ pickedIndex, column }, index) => {
        values.push(getItemValue(column[pickedIndex], index))
        return pickedIndex
      })
      return { values, indexes }
    }
    const initCascade = () => {
      const { columns } = props
      const scrollColumns: ScrollColumn[] = []
      setChildren(scrollColumns, 0, columns as CascadeColumn[])
      return scrollColumns
    }
    const initNormal = () => {
      const { columns } = props
      return (columns as NormalColumn[]).map((column, columnIndex) => createScrollColumn(column, columnIndex))
    }
    const init = () => {
      scrollColumns.value = props.cascade ? initCascade() : initNormal()
      pickedIndexes = []
    }
    const change = (scrollColumn?: ScrollColumn) => {
      const { cascade } = props
      scrollColumn && cascade && rebuildChild(scrollColumn)

      const { values, indexes } = getPicked()
      if (isListEqual(indexes, pickedIndexes)) return
      pickedIndexes = indexes.slice()
      emit('change', values, indexes)
    }
    const stopScroll = () => {
      scrollColumns.value.forEach((scrollColumn) => {
        const { columnInstance } = scrollColumn
        if (!columnInstance) return
        columnInstance.stopScroll()
      })
      nextTick(() => change())
    }
    const setScrollInstance = (scrollColumn: ScrollColumn, instance: PickerColumnInstance | null) => {
      scrollColumn.columnInstance = instance
    }
    const confirm = () => {
      stopScroll()

      const { values, indexes } = getPicked()
      pickedIndexes = indexes.slice()
      emit('confirm', values, indexes)
      emit('update:modelValue', values)
    }

    const cancel = () => {
      stopScroll()

      const { values, indexes } = getPicked()
      pickedIndexes = indexes.slice()
      emit('cancel', values, indexes)
    }

    watch(
      [() => props.modelValue, () => props.columns],
      ([value, column], [oldValue, oldColumn]) => {
        if (isListEqual(value, oldValue) && isListEqual(column, oldColumn)) return
        init()
      },
      { immediate: true }
    )

    expose({
      init,
    })

    return {
      Transition,
      SmyPopup,
      localOptionHeight,
      center,
      columnHeight,
      scrollColumns,
      bem,
      getItemText,
      setScrollInstance,
      cancel,
      confirm,
      change,
      onOpen: () => emit('open'),
      onOpened: () => emit('opened'),
      onClose: () => emit('close'),
      onClosed: () => emit('closed'),
      onClickOverlay: () => emit('clickOverlay'),
      onRouteChange: () => emit('routeChange'),
      onUpdateShow: () => emit('update:show'),
    }
  },
})
</script>

<style lang="less">
@import '../popup/popup.less';
@import './picker.less';
</style>
