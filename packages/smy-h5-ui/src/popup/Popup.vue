<template>
  <smy-teleport :to="teleport" :disabled="teleportDisabled">
    <transition name="smy-fade" @after-enter="$emit('opened', $event)" @after-leave="$emit('closed', $event)">
      <div v-show="show" :style="{ zIndex: zIndex - 2 }" class="smy--box smy-popup">
        <div
          v-if="overlay"
          :class="overlayClass"
          :style="mergeStyles({ zIndex: zIndex - 1 }, overlayStyle)"
          class="smy-popup__overlay"
          @click="hidePopup"
        />
        <transition :name="transition || `smy-pop-${position}`">
          <div
            v-if="show"
            :class="[`smy-popup__content--${position}`, contentClass]"
            :style="mergeStyles({ zIndex: zIndex }, contentStyle)"
            v-bind="$attrs"
            class="smy-popup__content"
          >
            <slot />
          </div>
        </transition>
      </div>
    </transition>
  </smy-teleport>
</template>

<script>
import { createZIndexMixin } from '../_context/mixins/zIndex'
import { teleportMixin } from '../_mixins/teleport'
import { createLockMixin } from '../_context/mixins/lock'
import { addRouteListener } from '../_utils/vue/component'
import { props } from './props'
import SmyTeleport from '../teleport'
import { mergeStyles } from '../_utils/vue/mergeData'

export default {
  name: 'SmyPopup',
  inheritAttrs: false,
  mixins: [createZIndexMixin('show', 3), teleportMixin, createLockMixin('show', 'lockScroll')],
  components: { SmyTeleport },
  props,
  watch: {
    show(newValue) {
      this.$emit(newValue ? 'open' : 'close')
    },
  },
  created() {
    addRouteListener(this, () => this.$emit('route-change'))
  },
  methods: {
    mergeStyles,
    hidePopup() {
      this.$emit('click-overlay')
      if (!this.closeOnClickOverlay) return
      this.$emit('update:show', false)
    },
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
@import '../_styles/transition.less';
@import './popup.less';
</style>
