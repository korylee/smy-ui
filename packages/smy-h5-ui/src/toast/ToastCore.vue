<template>
  <div class="smy-toast" :style="toastStyle">
    <div :class="toastWrapClass" :style="{ zIndex }">
      <div class="smy-toast__content" :class="contentClass">
        <slot>
          <span v-html="content"></span>
        </slot>
      </div>
      <div class="smy-toast__action">
        <slot v-if="hasSlots('action')" name="action" />
        <template v-else-if="action">
          <span v-if="isString(action)" v-html="action"></span>
          <RenderToComp v-else-if="isFunction(action)" :render="action" />
          <component v-else :is="action" />
        </template>
        <smy-loading v-else-if="type === 'loading'" :type="loadingType" :size="loadingSize" />
      </div>
    </div>
  </div>
</template>

<script>
import SmyLoading from '../loading'
import { props, TOAST_TYPES } from './props'
import { createZIndexMixin } from '../_context/mixins/zIndex'
import { createLockMixin } from '../_context/mixins/lock'
import { SlotsMixin } from '@smy-h5/vtools'
import { isString, isFunction } from '../_utils/is'
import { addRouteListener, RenderToComp } from '../_utils/components'

export default {
  name: 'SmyToastCore',
  components: {
    SmyLoading,
    RenderToComp,
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
          'smy-toast__wrapper--vertical': vertical,
          [`smy-toast__wrapper--${type}`]: TOAST_TYPES.includes(type),
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
  created() {
    addRouteListener(this, () => this.$emit('route-change'))
  },
  methods: {
    isString,
    isFunction,
    updateAfterDuration() {
      this.timer = setTimeout(() => {
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
