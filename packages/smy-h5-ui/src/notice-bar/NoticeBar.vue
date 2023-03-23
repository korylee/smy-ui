<template>
  <div
    v-show="showNoticeBar"
    :class="{ 'nut-noticebar--close': closable, 'nut-noticebar--wrapable': wrapable }"
    class="smy-notice-bar"
    role="alert"
    @click="$emit('click', $event)"
  >
    <div v-if="$slots['left-icon']" class="smy-notice-bar__left-icon">
      <slot name="left-icon"> </slot>
    </div>
    <div ref="wrap" class="smy-notice-bar__content-wrap" role="marquee">
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
    <div v-if="closable || $slots['right-icon']" class="smy-notice-bar__right-icon">
      <slot name="right-icon">
        <smy-icon @click.stop="handleClickClose"><window-close /></smy-icon>
      </slot>
    </div>
  </div>
</template>

<script>
import { props } from './props'
import WindowClose from '@smy-h5/icons/WindowClose'
import SmyIcon from '../icon'
import { SlotsMixin } from '../_utils/vue/slots'

export default {
  name: 'SmyNoticeBar',
  mixins: [SlotsMixin],
  components: { WindowClose, SmyIcon },
  props,
  data: () => ({
    wrapWidth: 0,
    showNoticeBar: true,
    animate: false,
    firstRound: true,
    duration: 0,
    offsetWidth: 0,
    animationClass: '',
    distance: 0,
  }),
  computed: {
    contentStyle() {
      return {
        paddingLeft: this.firstRound ? 0 : this.wrapWidth + 'px',
        animationDelay: (this.firstRound ? this.delay : 0) + 's',
        animationDuration: this.duration + 's',
      }
    },
  },
  watch: {
    text: {
      immediate: true,
      handler: 'reset',
    },
  },
  methods: {
    async reset() {
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
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
@import '../icon/icon.less';
@import './noticeBar.less';
</style>
