<template>
  <smy-teleport :to="teleport" :disabled="teleportDisabled">
    <transition name="smy-fade" @after-enter="$emit('opened')" @after-leave="$emit('closed')">
      <div
        v-show="show"
        :style="{ zIndex: zIndex - 2 }"
        :class="[bem(['$--box']), wrapperClass]"
        role="dialog"
        tabindex="0"
      >
        <div
          v-if="overlay"
          :class="[overlayClass, bem('overlay')]"
          :style="mergeStyles({ zIndex: zIndex - 1 }, overlayStyle)"
          @click="hidePopup"
        />
        <transition :name="getTransition()">
          <div
            v-if="show"
            :class="[
              contentClass,
              bem('content', {
                [position]: position,
                round,
                '$--safe-area-top': safeAreaInsetTop,
                '$--safe-area-bottom': safeAreaInsetBottom,
              }),
            ]"
            :style="mergeStyles({ zIndex: zIndex }, contentStyle)"
            v-bind="$attrs"
            v-on="$listeners"
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
import { createNamespace } from '../_utils/vue/create'
import { POPUP_BIND_CHILDREN_KEY } from './provide'

const [name, bem] = createNamespace('popup')

export default {
  name,
  inheritAttrs: false,
  mixins: [createZIndexMixin('show', 3), teleportMixin, createLockMixin('show', 'lockScroll')],
  provide() {
    return { [POPUP_BIND_CHILDREN_KEY]: this }
  },
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
    bem,
    mergeStyles,
    getTransition() {
      const { transition, position } = this
      if (transition) {
        return transition
      }
      if (position === 'center') {
        return 'smy-scale'
      }
      return `smy-slide-${position}`
    },
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
