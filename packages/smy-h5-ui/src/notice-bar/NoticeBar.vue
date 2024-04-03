<template>
  <div v-show="show" :class="bem({ closeable, wrapable })" role="alert" @click="$emit('click', $event)">
    <div v-if="hasSlot('left-icon')" :class="bem('left-icon')">
      <slot name="left-icon"> </slot>
    </div>
    <div ref="wrap" :class="bem('content-wrap')" role="marquee">
      <div
        ref="content"
        :class="[bem('content', { [animation]: animation, '$--ellipsis': !scrollable && !wrapable })]"
        :style="contentStyle"
        @animationend="onAnimationEnd"
        @webkitAnimationEnd="onAnimationEnd"
      >
        <slot>{{ text }}</slot>
      </div>
    </div>
    <div v-if="closeable || hasSlot('right-icon')" :class="bem('right-icon')">
      <slot name="right-icon">
        <smy-icon name="window-close" @click.stop="onClickRightIcon" />
      </slot>
    </div>
  </div>
</template>

<script>
import { props } from './props'
import WindowClose from '@smy-h5/icons/dist/es/WindowClose'
import SmyIcon from '../icon'
import { SlotsMixin } from '../_utils/vue/slots'
import { doubleRaf, getRect } from '@smy-h5/shared'
import { createNamespace } from '../_utils/vue/create'
import { useWindowSize } from '../_utils/composable/useWindowSize'
import { PopupMixin } from '../popup/provide'
import { onMountedOrActivated } from '../_utils/vue/lifetime'

SmyIcon.use('window-close', WindowClose)

const [name, bem] = createNamespace('notice-bar')

export default {
  name,
  mixins: [SlotsMixin, PopupMixin],
  components: { SmyIcon },
  props,
  data: () => ({
    wrapWidth: 0,
    show: true,
    isReplay: false,
    duration: 0,
    offsetWidth: 0,
    animation: '',
  }),
  computed: {
    contentStyle({ isReplay, wrapWidth, delay, duration }) {
      return {
        paddingLeft: isReplay ? wrapWidth : 0 + 'px',
        animationDelay: (isReplay ? 0 : delay) + 'ms',
        animationDuration: duration + 's',
      }
    },
  },
  created() {
    const vm = this
    const windowSize = useWindowSize()
    vm.$watch(() => [vm.text, vm.scrollable, windowSize.width], vm.reset)
    onMountedOrActivated(vm, vm.reset)
    vm.popupProvider?.$on('show', vm.reset)
  },
  methods: {
    bem,
    reset() {
      this.$nextTick(() => {
        if (!this.show) return
        const { wrap, content } = this.$refs
        if (!wrap || !content) return
        const wrapWidth = getRect(wrap).width
        const offsetWidth = getRect(content).width
        if (this.scrollable && offsetWidth > wrapWidth) {
          this.wrapWidth = wrapWidth
          this.offsetWidth = offsetWidth
          this.duration = offsetWidth / +this.speed
          this.animation = 'play'
        } else {
          this.animation = ''
        }
      })
    },
    onClickRightIcon(event) {
      if (this.closeable) {
        this.show = false
        this.$emit('close', event)
      }
    },
    onAnimationEnd() {
      this.isReplay = true
      doubleRaf(() => {
        const { offsetWidth, wrapWidth, speed } = this
        this.duration = (offsetWidth + wrapWidth) / speed
        this.animation = 'play-infinite'
        this.$emit('replay')
      })
    },
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
@import '../icon/icon.less';
@import './noticeBar.less';
</style>
