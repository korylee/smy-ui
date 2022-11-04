<template>
  <div
    v-if="direction === 'across'"
    v-show="showNoticeBar"
    :class="{ 'nut-noticebar--close': closable, wrapable }"
    class="smy-notice-bar"
    @click="onClick"
  >
    <div v-if="iconShow" class="smy-notice-bar__left-icon">
      <slot name="left-icon"> </slot>
    </div>
    <div ref="wrap" class="smy-notice-bar__content-wrap">
      <div
        ref="content"
        :class="[animationClass, { 'smy--ellipsis': !scrollable && !wrapable }]"
        :style="contentStyle"
        class="smy-notice-bar__content"
        @animationend="onAnimationEnd"
        @webkitAnimationEnd="onAnimationEnd"
      >
        <slot>{{ text }}</slot>
      </div>
    </div>
    <div v-if="closable" class="smy-notice-bar__right-icon" @click.stop="handleClickClose">
      <slot name="right-icon">
        <CloseIcon />
      </slot>
    </div>
  </div>
  <div v-else-if="direction === 'vertical' && scrollList.length > 0" class="smy-notice-bar smy-notice-bar__vertical">
    <template>
      <ul class="horse-lamp-list">
        <li v-for="(item, index) in scrollList" :key="index" class="horse-lamp-list__item" @click="onClick">
          {{ item }}
        </li>
      </ul>
    </template>
    <div></div>
  </div>
</template>

<script>
import { SlotsMixin } from '@smy-h5/vtools'
import { props } from './props'
import CloseIcon from '../_icon/CloseSvg.vue'

export default {
  name: 'SmyNoticeBar',
  mixins: [SlotsMixin],
  components: { CloseIcon },
  props,
  data: () => ({
    wrapWidth: 0,
    showNoticeBar: true,
    animate: false,
    firstRound: true,
    duration: 0,
    offsetWidth: 0,
    scrollList: [],
    animationClass: '',
    anmate: false,
    distance: 0,
    timer: null,
  }),
  computed: {
    iconShow() {
      return this.leftIcon === 'close'
    },
    contentStyle() {
      return {
        paddingLeft: this.firstRound ? 0 : this.wrapWidth + 'px',
        animationDelay: (this.firstRound ? this.delay : 0) + 's',
        animationDuration: this.duration + 's',
      }
    },
    barStyle() {
      return {
        color: this.color,
        background: this.background,
        height: this.direction === 'vertical' ? `${this.height}px` : undefined,
      }
    },
  },
  watch: {
    text: {
      immediate: true,
      async handler() {
        if (!this.showNoticeBar) return
        await this.$nextTick()
        const { wrap, content } = this.$refs
        if (!wrap || !content) return
        const wrapWidth = wrap.getBoundingClientRect().width
        const offsetWidth = content.getBoundingClientRect().width
        if (this.scrollable && offsetWidth > wrapWidth) {
          this.wrapWidth = wrapWidth
          this.offsetWidth = offsetWidth
          this.duration = offsetWidth / this.speed
          this.animationClass = 'smy-notice-bar-play'
        } else {
          this.animationClass = ''
        }
      },
    },
    list(newValue) {
      this.scrollList = [...newValue]
    },
  },
  mounted() {
    // if (this.direction === 'vertical') {
    //   setTimeout(() => {
    //     this.startRoll()
    //   }, this.standTime)
    // }

    this.$once('destroyed', () => {
      clearInterval(this.timer)
    })
  },
  methods: {
    handleClickClose(event) {
      this.showNoticeBar = !this.closable
      this.$emit('close', event)
    },
    async onAnimationEnd() {
      this.firstRound = false
      await this.$nextTick()
      this.duration = (this.offsetWidth + this.wrapWidth) / this.speed
      this.animationClass = 'smy-notice-bar-play-infinite'
    },
    startRoll() {
      this.timer = setInterval(() => {
        const chunk = 100
        for (let i = 0; i < chunk; i++) {
          this.scroll(i, i >= chunk - 1)
        }
      }, this.standTime + 100 * this.speed)
    },
    scroll(n, last) {
      setTimeout(() => {
        this.distance -= this.height / 100
        if (!last) return
        this.distance = 0
      }, n * this.speed)
    },
    onClick(e) {
      this.$listeners.click?.(e)
    },
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
@import './noticeBar.less';
</style>
