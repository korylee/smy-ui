<template>
  <div class="smy-toast" :style="toastStyle">
    <div :class="toastWrapClass" :style="{ zIndex }">
      <div class="smy-toast__content" :class="contentClass">
        <slot>{{ content }}</slot>
      </div>
      <div class="smy-toast__action">
        <Loading v-if="type === 'loading'" :type="loadingType" :size="loadingSize" />
        <slot name="action" />
      </div>
    </div>
  </div>
</template>

<script>
import Loading from '../loading'
import { props, TOAST_TYPES } from './props'
import { createZIndexMixin } from '../_context/mixins/zIndex'
import { createLockMixin } from '../_context/mixins/lock'
import { SlotsMixin } from '@smy-h5/vtools'

export default {
  name: 'SmyToastCore',
  components: {
    Loading,
  },
  mixins: [SlotsMixin, createZIndexMixin('show'), createLockMixin('show', 'lockScroll')],
  props,
  data: () => ({
    timer: null,
  }),
  computed: {
    toastWrapClass({ position, vertical, type }) {
      const baseClass = `smy-toast__wrapper smy-toast__wrapper--${position} smy-elevation--4`
      return [
        baseClass,
        {
          'smy-toast__vertical': vertical,
          [`smy-toast__wrapper--${type}`]: type && TOAST_TYPES.includes(type),
        },
      ]
    },
    toastStyle({ zIndex }) {
      const isForbidClick = this.type === 'loading' || this.forbidClick
      return {
        pointerEvents: isForbidClick ? 'auto' : 'none',
        zIndex,
      }
    },
  },
  watch: {
    show: {
      immediate: true,
      handler(show) {
        if (show) {
          this.$emit('open')
          this.updateAfterDuration()
        } else if (show === false) {
          clearTimeout(this.timer)
          this.$emit('close')
        }
      },
    },
    customUpdate() {
      clearTimeout(this.timer)
      this.updateAfterDuration()
    },
  },
  // mounted() {
  //   if (this.show) {
  //     this.$emit('open')
  //     this.updateAfterDuration()
  //   }
  // },
  methods: {
    updateAfterDuration() {
      this.tiemr = setTimeout(() => {
        this.$emit('update:show', false)
      }, this.duration)
    },
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
@import './toast.less';
</style>
