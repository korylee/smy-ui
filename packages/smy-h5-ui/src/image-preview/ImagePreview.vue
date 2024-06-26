<template>
  <smy-popup
    :show.sync="internalShow"
    :overlay="false"
    :close-on-click-overlay="false"
    :lock-scroll="lockScroll"
    :teleport="teleport"
    :wrapper-class="bem('popup')"
    :content-class="bem()"
    transition="smy-fade"
    v-on="getListeners(['open', 'opened', 'close', 'closed', 'route-change'])"
  >
    <smy-swiper
      v-bind="$attrs"
      :loop="loop"
      :touchable="touchable"
      :initial-index="initialIndex"
      :class="bem('swiper')"
      @change="$emit('change', $event)"
    >
      <smy-swiper-item v-for="(image, index) of images" :key="index" :class="bem('swiper-item')">
        <div
          :style="zoomContainerStyle"
          :class="bem('zoom-container')"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
          @touchcancel="handleTouchEnd"
        >
          <slot name="image" :image="image"><img :src="image" :alt="image" :class="bem('image')" /></slot>
        </div>
      </smy-swiper-item>
      <template #indicator="{ index, length }">
        <slot name="indicator" :index="index" :length="length">
          <div v-if="indicator && images.length" :class="bem('indicator')">{{ index + 1 }} / {{ length }}</div>
        </slot>
      </template>
    </smy-swiper>
    <slot name="close-icon">
      <smy-icon
        v-if="closeable"
        :name="closeIcon"
        :class="bem('close-icon', [closeIconPosition])"
        @click="handleClose"
      />
    </slot>
    <div v-if="$slots.extra" :class="bem('extra')">
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
import { toNumber, range } from '@smy-h5/shared'
import { createTouch, isTapTouch, ANIMATION_DURATION, EVENT_DELAY, isDoubleTouch } from './utils'
import { createProxiedModel } from '../_mixins/proxiedModel'
import { createNamespace } from '../_utils/vue/create'
import { ListenersMixin } from '../_mixins/listeners'

const [name, bem] = createNamespace('image-preview')

export default {
  name,
  inheritAttrs: false,
  components: { SmyPopup, SmySwiper, SmySwiperItem, SmyIcon },
  mixins: [createProxiedModel('show', 'internalShow', { passive: false, event: 'update:show' }), ListenersMixin],
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
    zoomContainerStyle({ transitionTimingFunction, transitionDuration, scale, translateX, translateY }) {
      return {
        transform: `scale(${scale}) translate(${translateX}px, ${translateY}px) translateZ(0)`,
        transitionTimingFunction,
        transitionDuration,
      }
    },
  },
  methods: {
    bem,
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
    getZoom(target) {
      const { offsetWidth, offsetHeight } = target
      let imgDom = target.querySelector(bem('image'))
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
    handleTouchStart(event) {
      const { checkTimer } = this
      checkTimer && window.clearTimeout(checkTimer)
      const currentTouch = createTouch(event)
      this.startTouch = currentTouch
      if (isDoubleTouch(this.prevTouch, currentTouch)) {
        this.scale > 1 ? this.zoomOut() : this.zoomIn()
        return
      }
      this.prevTouch = currentTouch
    },
    handleTouchMove(event) {
      const { prevTouch, translateX, translateY } = this
      if (!prevTouch) return
      const currentTouch = createTouch(event)
      if (this.scale > 1) {
        const moveX = currentTouch.clientX - prevTouch.clientX
        const moveY = currentTouch.clientY - prevTouch.clientY
        const { limitX, limitY } = this.getLimit(currentTouch.target)
        this.translateX = range(translateX + moveX, -limitX, limitX)
        this.translateY = range(translateY + moveY, -limitY, limitY)
      }
      this.prevTouch = currentTouch
    },
    handleTouchEnd(event) {
      this.checkTimer = window.setTimeout(() => {
        isTapTouch(event.target, this.startTouch, this.prevTouch) && this.handleClose()
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
@import '../swiper-item/swiperItem.less';
@import '../popup/popup.less';
@import './imagePreview.less';
</style>
