<template>
  <Popup
    :show.sync="internalShow"
    :teleport="teleport"
    :close-on-click-overlay="closeOnClickOverlay"
    smy-picker-cover
    position="bottom"
    class="smy-picker__popup"
    @click-overlay="$emit('click-overlay')"
    @open="$emit('open')"
    @opened="$emit('opened')"
    @close="$emit('close')"
    @closed="$emit('closed')"
    @route-change="$emit('route-change')"
  >
    <div class="smy-picker" v-bind="$attrs">
      <div class="smy-picker__toolbar">
        <slot name="cancel">
          <span class="smy-picker__cancel-button" smy-picker-cover @click="handleCancel">
            {{ cancelButtonText }}
          </span>
        </slot>
        <slot name="title">
          <div class="smy-picker__title">{{ title }}</div>
        </slot>
        <slot name="confirm">
          <span class="smy-picker__confirm-button" smy-picker-cover @click="handleConfirm">
            {{ confirmButtonText }}
          </span>
        </slot>
      </div>
      <slot name="top"></slot>
      <div class="smy-picker__columns" :style="{ height: `${columnHeight}px` }">
        <div
          class="smy-picker__column"
          v-for="scrollCol in scrollColumns"
          :key="scrollCol.id"
          @touchstart="handleTouchstart($event, scrollCol)"
          @touchmove.prevent="handleTouchmove($event, scrollCol)"
          @touchend="handleTouchend($event, scrollCol)"
        >
          <div
            class="smy-picker__scroller"
            ref="scrollEl"
            :style="getScrollerStyle(scrollCol)"
            @transitionend="handleTransitionend(scrollCol)"
          >
            <div
              v-for="(text, textIndex) in scrollCol.column.texts"
              :key="text"
              :class="{
                'smy-picker__option--picked': textIndex === scrollCol.index,
              }"
              :style="{
                height: `${localOptionHeight}px`,
              }"
              class="smy-picker__option"
            >
              <div class="smy-picker__text">
                {{ textFormatter(text, scrollCol.columnIndex) }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="smy-picker__picked"
          :style="{
            top: `${center}px`,
            height: `${localOptionHeight}px`,
          }"
        ></div>
        <div
          class="smy-picker__mask"
          :style="{
            backgroundSize: `100% ${center}px`,
          }"
        ></div>
      </div>
    </div>
  </Popup>
</template>

<script>
import Popup from '../popup'
import { toPxNum } from '../_utils/shared'
import { props } from './props'

function getTranslate(el) {
  const { transform } = window.getComputedStyle(el)
  return +transform.slice(transform.lastIndexOf(',') + 2, transform.length - 1)
}

const MOMENTUM_RECORD_TIME = 300
const MOMENTUM_ALLOW_DISTANCE = 15

let sid = 0

export default {
  name: 'SmyPicker',
  components: { Popup },
  props,
  data: () => ({
    scrollColumns: [],
    prevIndexes: [],
  }),
  computed: {
    internalShow: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('update:show', val)
      },
    },
    localOptionHeight() {
      return toPxNum(this.optionHeight)
    },
    localOptionCount() {
      return toPxNum(this.optionCount)
    },
    center() {
      return (this.columnHeight - this.localOptionHeight) / 2
    },
    columnHeight() {
      return this.localOptionCount * this.localOptionHeight
    },
  },
  watch: {
    columns: {
      immediate: true,
      handler(val) {
        this.scrollColumns = this.normalizeNormalColumns(val)
        const { indexes } = this.getPicked()
        this.prevIndexes = [...indexes]
      },
    },
  },

  mounted() {
    this.setScrollEls()
    this.$on('hook:updated', this.setScrollEls)
  },

  methods: {
    handleConfirm() {
      this.stopScroll()

      const { texts, indexes } = this.getPicked()
      this.prevIndexes = [...indexes]
      this.$emit('confirm', texts, indexes)
    },
    initIndex() {
      this.scrollColumns.forEach((scrollCol) => {
        const index = scrollCol.column.initialIndex || 0
        scrollCol.index = index
        this.scrollTo(scrollCol, index, 200)
      })
    },
    handleCancel() {
      this.stopScroll()
      this.initIndex()

      const { texts, indexes } = this.getPicked()
      this.prevIndexes = [...indexes]
      this.$emit('cancel', texts, indexes)
    },
    handleTouchstart(e, scrollCol) {
      scrollCol.touching = true
      scrollCol.scrolling = false
      scrollCol.duration = 0
      scrollCol.translate = getTranslate(scrollCol.scrollEl)
    },
    handleTouchmove(event, scrollCol) {
      if (!scrollCol.touching) return

      const { clientY } = event.touches[0]
      const moveY = scrollCol.prevY !== undefined ? clientY - scrollCol.prevY : 0
      scrollCol.prevY = clientY
      scrollCol.translate += moveY

      this.limitTranslate(scrollCol)

      const now = performance.now()
      if (now - scrollCol.momentumTime > MOMENTUM_RECORD_TIME) {
        scrollCol.momentumTime = now
        scrollCol.momentumPrevY = scrollCol.translate
      }
    },
    handleTouchend(event, scrollCol) {
      scrollCol.touching = false
      scrollCol.scrolling = true
      scrollCol.prevY = undefined
      const distance = scrollCol.translate - scrollCol.momentumPrevY
      const duration = performance.now() - scrollCol.momentumTime
      const shouldMomentum = Math.abs(distance) >= MOMENTUM_ALLOW_DISTANCE && duration <= MOMENTUM_RECORD_TIME
      shouldMomentum && this.momentum(scrollCol, distance, duration)
      scrollCol.index = this.getIndex(scrollCol)
      this.scrollTo(scrollCol, scrollCol.index, shouldMomentum ? 1000 : 200)
    },
    handleTransitionend(scrollCol) {
      scrollCol.scrolling = false
      this.change(scrollCol)
    },
    stopScroll() {
      this.scrollColumns.forEach((scrollColumn) => {
        scrollColumn.translate = getTranslate(scrollColumn.scrollEl)
        scrollColumn.index = this.getIndex(scrollColumn)
        this.scrollTo(scrollColumn, scrollColumn.index, 0)
      })
    },
    getIndex(scrollCol) {
      const index = Math.round((this.center - scrollCol.translate) / this.localOptionHeight)
      return this.boundaryIndex(scrollCol, index)
    },
    setScrollEls() {
      const { scrollEl } = this.$refs
      if (!scrollEl) return

      this.scrollColumns.forEach((scrollColumn, index) => {
        scrollColumn.scrollEl = scrollEl[index]
      })
    },

    getScrollerStyle(scrollCol) {
      return {
        transform: `translate3d(0, ${scrollCol.translate}px, 0)`,
        transitionDuration: `${scrollCol.duration}ms`,
        transitionProperty: scrollCol.duration ? 'transform' : 'none',
      }
    },

    limitTranslate(scrollCol) {
      const START_LIMIT = this.localOptionHeight + this.center
      const END_LIMIT = this.center - scrollCol.column.texts.length * this.localOptionHeight

      if (scrollCol.translate >= START_LIMIT) {
        scrollCol.translate = START_LIMIT
      }
      if (scrollCol.translate <= END_LIMIT) {
        scrollCol.translate = END_LIMIT
      }
    },
    boundaryIndex(scrollColumn, index) {
      const { length } = scrollColumn.column.texts
      index = index >= length ? length - 1 : index
      index = index <= 0 ? 0 : index
      return index
    },
    momentum(scrollColumn, distance, duration) {
      scrollColumn.translate += (Math.abs(distance / duration) / 0.003) * (distance < 0 ? -1 : 1)
    },

    scrollTo(scrollColumn, index, duration, noEmit = false) {
      const translate = this.center - this.boundaryIndex(scrollColumn, index) * this.localOptionHeight

      if (translate === scrollColumn.translate) {
        scrollColumn.scrolling = false
        !noEmit && this.change(scrollColumn)
      }

      scrollColumn.translate = translate
      scrollColumn.duration = duration
    },
    normalizeNormalColumns(columns) {
      return columns.map((col, colIndex) => {
        const column = Array.isArray(col) ? { texts: col } : col
        const scollColumn = {
          id: sid++,
          prevY: undefined,
          momentumPrevY: undefined,
          momentumTime: 0,
          touching: false,
          translate: this.center,
          index: column.initialIndex || 0,
          column,
          columnIndex: colIndex,
          duration: 0,
          scrollEl: null,
          scrolling: false,
        }
        this.scrollTo(scollColumn, scollColumn.index, 200)
        return scollColumn
      })
    },
    getPicked() {
      const indexes = []
      const texts = this.scrollColumns.map((scrollCol) => {
        const { index } = scrollCol
        indexes.push(index)
        return scrollCol.column.texts[index]
      })
      // const indexes = this.scrollColumns.map((scrollColumn) => scrollColumn.index)
      return {
        texts,
        indexes,
      }
    },
    change(scrollColumn) {
      const hasScrolling = this.scrollColumns.some((scrollColumn) => scrollColumn.scrolling)
      if (hasScrolling) return
      const { texts, indexes } = this.getPicked()
      const samePicked = indexes.every((index, idx) => index === this.prevIndexes[idx])
      if (samePicked) return
      this.prevIndexes = [...indexes]
      this.$emit('change', texts, indexes)
    },
  },
}
</script>

<style lang="less">
@import './picker.less';
</style>
