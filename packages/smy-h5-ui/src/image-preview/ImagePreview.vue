<template>
  <smy-popup
    :show.sync="internalShow"
    :overlay="false"
    :close-on-click-overlay="false"
    :lock-scroll="lockScroll"
    :teleport="teleport"
    class="smy-image-preview__popup"
    transition="smy-fade"
    @open="$emit('open')"
    @opened="$emit('opened')"
    @close="$emit('close')"
    @closed="$emit('closed')"
    @route-change="$emit('route-change')"
  >
    <smy-swiper
      v-bind="$attrs"
      :loop="loop"
      :touchable="touchable"
      :initial-index="initialIndex"
      class="smy-image-preview__swiper"
      @change="$emit('change', $event)"
    >
      <smy-swiper-item v-for="(image, index) of images" :key="index" class="smy-image-preview__swiper-item">
        <div
          :style="zoomContainerStyle"
          class="smy-image-preview__zoom-container"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
          @touchcancel="handleTouchEnd"
        >
          <slot name="image" :image="image">
            <img :src="image" :alt="image" class="smy-image-preview__image" />
          </slot>
        </div>
      </smy-swiper-item>
      <template #indicator="{ index, length }">
        <slot name="indicator" :index="index" :length="length">
          <div v-if="indicator && images.length" class="smy-image-preview__indicators">
            {{ index + 1 }} / {{ length }}
          </div>
        </slot>
      </template>
    </smy-swiper>
    <slot name="close-icon">
      <smy-icon v-if="closeable" class="smy-image-preview__close-icon" @click="handleClose"></smy-icon>
    </slot>
    <div v-if="$slots.extra" class="smy-image-preview__extra">
      <slot name="extra" />
    </div>
  </smy-popup>
</template>
<script>
import SmyPopup from '../popup'
import SmyIcon from '../icon'
import SmySwiper from '../swiper'
import SmySwiperItem from '../swiper-item'
import { props } from './props'
import { toNumber } from '../_utils/shared'

const DISTANCE_OFFSET = 12
const EVENT_DELAY = 200
const ANIMATION_DURATION = 200

export default {
  name: 'SmyImagePreview',
  inheritAttrs: false,
  components: { SmyPopup, SmySwiper, SmySwiperItem, SmyIcon },
  props,
  data: () => ({
    scale: 1,
    translateX: 0,
    translateY: 0,
    touchable: true,
    startTouch: null,
    prevTouch: null,
    transitionTimingFunction: undefined,
    transitionDuration: undefined,
    checkTimer: null,
  }),
  computed: {
    internalShow: {
      get() {
        return this.show
      },
      set(val) {
        if (val === this.show) return
        this.$emit('update:show', val)
      },
    },
    zoomContainerStyle() {
      const { transitionTimingFunction, transitionDuration } = this
      return {
        transform: `scale(${this.scale}) translate3d(${this.translateX}px, ${this.translateY}px, 0)`,
        transitionTimingFunction,
        transitionDuration,
      }
    },
  },
  methods: {
    getDistance(touchA, touchB) {
      const { clientX: aX, clientY: aY } = touchA
      const { clientX: bX, clientY: bY } = touchB
      return Math.abs(Math.sqrt((aX - bX) ** 2 + (aY - bY) ** 2))
    },
    createTouch(touchEvent) {
      const { currentTarget: target, touches } = touchEvent
      const { clientX, clientY } = touches[0]
      return { target, clientX, clientY, timestamp: Date.now() }
    },
    zoomIn() {
      this.scale = toNumber(this.zoom)
      this.touchable = false
      this.prevTouch = null

      window.setTimeout(() => {
        this.transitionTimingFunction = 'linear'
        this.transitionDuration = '0s'
      }, ANIMATION_DURATION)
    },
    zoomOut() {
      this.scale = 1
      this.translateX = 0
      this.translateY = 0
      this.touchable = true
      this.prevTouch = null
      this.transitionTimingFunction = undefined
      this.transitionDuration = undefined
    },
    isDoubleTouch() {
      const { prevTouch, startTouch } = this
      if (!prevTouch) return false
      return (
        this.getDistance(prevTouch, startTouch) <= DISTANCE_OFFSET &&
        startTouch.timestamp - prevTouch.timestamp <= EVENT_DELAY &&
        prevTouch.target === startTouch.target
      )
    },
    isTapTouch(target) {
      const { prevTouch, startTouch } = this
      if (!target || !startTouch || !prevTouch) return false
      return (
        this.getDistance(startTouch, prevTouch) <= DISTANCE_OFFSET &&
        (target === startTouch.target || target.parentNode === startTouch.target)
      )
    },
    getZoom(target) {
      const { offsetWidth, offsetHeight } = target
      let imgDom = target.querySelector('.smy-image-preview__image')
      if (!imgDom) {
        imgDom = target.querySelector('img')
      }
      const { naturalHeight, naturalWidth } = imgDom
      return {
        width: offsetWidth,
        height: offsetHeight,
        zoom: toNumber(this.zoom),
        imageRadio: naturalHeight / naturalWidth,
        rootRadio: offsetHeight / offsetWidth,
      }
    },
    getLimit(target) {
      const { zoom, imageRadio, rootRadio, width, height } = this.getZoom(target)
      if (!imageRadio) return { limitX: 0, limitY: 0 }
      const displayWidth = imageRadio > rootRadio ? height / imageRadio : width
      const limitX = Math.max(0, (zoom * displayWidth - width) / 2) / zoom
      const displayHeight = imageRadio > rootRadio ? height : width * imageRadio
      const limitY = Math.max(0, (zoom * displayHeight - height) / 2) / zoom
      return { limitX, limitY }
    },
    getMoveTranslate(current, move, limit) {
      if (current + move >= limit) {
        return limit
      }
      if (current + move <= -limit) {
        return -limit
      }
      return current + move
    },
    handleTouchStart(event) {
      this.checkTimer && window.clearTimeout(this.checkTimer)
      const currentTouch = this.createTouch(event)
      this.startTouch = currentTouch
      if (this.isDoubleTouch()) {
        this.scale > 1 ? this.zoomOut() : this.zoomIn()
        return
      }
      this.prevTouch = currentTouch
    },
    handleTouchMove(event) {
      const { prevTouch } = this
      if (!prevTouch) return
      const currentTouch = this.createTouch(event)
      if (this.scale > 1) {
        const moveX = currentTouch.clientX - prevTouch.clientX
        const moveY = currentTouch.clientY - prevTouch.clientY
        const { limitX, limitY } = this.getLimit(currentTouch.target)
        this.translateX = this.getMoveTranslate(this.translateX, moveX, limitX)
        this.translateY = this.getMoveTranslate(this.translateY, moveY, limitY)
      }
      this.prevTouch = currentTouch
    },
    handleTouchEnd(event) {
      this.checkTimer = window.setTimeout(() => {
        this.isTapTouch(event.target) && this.handleClose()
        this.startTouch = null
      }, EVENT_DELAY)
    },
    handleClose() {
      if (this.scale > 1) {
        this.zoomOut()
        window.setTimeout(() => (this.internalShow = false), ANIMATION_DURATION)
        return
      }
      this.internalShow = false
    },
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
@import '../icon/icon.less';
@import '../swiper/swiper.less';
@import '../popup/popup.less';
@import './imagePreview.less';
</style>
