<template>
  <div v-show="showNoticeBar" :class="bem({ closable, wrapable })" role="alert" @click="$emit('click', $event)">
    <div v-if="$slots['left-icon']" :class="bem('left-icon')">
      <slot name="left-icon"> </slot>
    </div>
    <div ref="wrap" :class="bem('content-wrap')" role="marquee">
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
    <div v-if="closable || $slots['right-icon']" :class="bem('right-icon')">
      <slot name="right-icon">
        <smy-icon @click.stop="close"><window-close /></smy-icon>
      </slot>
    </div>
  </div>
</template>

<script>
import { props } from './props'
import WindowClose from '@smy-h5/icons/dist/es/WindowClose'
import SmyIcon from '../icon'
import { getRect } from '../_utils/dom'
import { createNamespace } from '../_utils/vue/create'
import { computed, defineComponent, nextTick, ref, watch } from 'vue'

const [name, bem] = createNamespace('notice-bar')

export default defineComponent({
  name,
  components: { WindowClose, SmyIcon },
  props,
  setup(props, { expose, emit }) {
    const showNoticeBar = ref(true)
    const wrap = ref(null)
    const content = ref(null)
    const animationClass = ref('')
    const firstRound = ref(false)
    const duration = ref(0)
    const wrapWidth = ref(0)
    let offsetWidth = 0
    const contentStyle = computed(() => ({
      paddingLeft: firstRound.value ? 0 : wrapWidth.value + 'px',
      animationDelay: (firstRound.value ? props.delay : 0) + 's',
      animationDuration: duration.value + 's',
    }))

    const reset = () => {
      if (!wrap.value || !content.value) return
      const wrapRefWidth = getRect(wrap.value).width
      const offsetRefWidth = getRect(content.value).width
      if (props.scrollable && offsetRefWidth > wrapRefWidth) {
        wrapWidth.value = wrapRefWidth
        offsetWidth = offsetRefWidth
        duration.value = offsetRefWidth / props.speed
        animationClass.value = 'smy-notice-bar-play'
      } else {
        animationClass.value = ''
      }
    }

    const close = (event) => {
      showNoticeBar.value = !props.closable
      emit('close', event)
    }
    const onAnimationEnd = () => {
      firstRound.value = false
      nextTick(() => {
        duration.value = (offsetWidth + wrapWidth.value) / props.speed
        animationClass.value = 'smy-notice-bar-play-infinite'
      })
    }

    watch(() => props.text, reset, { immediate: true })

    expose({ reset })

    return {
      showNoticeBar,
      wrap,
      content,
      animationClass,
      contentStyle,
      bem,
      close,
      onAnimationEnd,
    }
  },
})
</script>

<style lang="less">
@import '../_styles/common.less';
@import '../icon/icon.less';
@import './noticeBar.less';
</style>
