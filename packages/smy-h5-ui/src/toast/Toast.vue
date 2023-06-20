<template>
  <smy-popup
    :show.sync="internalShow"
    v-bind="popupProps"
    :content-class="toastClass"
    :wrapper-class="toastPopupClass"
    @click="onClick"
    @closed="$emit('closed')"
    @opened="$emit('opened')"
    @route-change="$emit('route-change')"
  >
    <div v-if="hasIcon" class="smy-toast__icon">
      <slot name="icon">
        <toast-icon v-if="icon" :icon="icon" :size="iconSize" />
        <smy-loading v-else-if="type === 'loading'" :type="loadingType" :size="loadingSize" />
      </slot>
    </div>
    <div class="smy-toast__content" :class="contentClass">
      <slot> <span v-html="content"></span> </slot>
    </div>
  </smy-popup>
</template>

<script>
import SmyPopup from '../popup'
import SmyLoading from '../loading'
import SmyIcon from '../icon'
import { props, popupInheritProps } from './props'
import { isString, isFunction } from '../_utils/is'
import { SlotsMixin, hasSlot } from '../_utils/vue/slots'
import { createProxiedModel } from '../_mixins/proxiedModel'
import { pick } from '../_utils/shared'
import { createNamespace } from '../_utils/vue/create'

const [name, bem] = createNamespace('toast')

const ToastIcon = {
  functional: true,
  props: { icon: [String, Function], size: [String, Number] },
  render(h, { props }) {
    const { icon, size } = props
    if (isFunction(icon)) return icon(h)
    if (isString(icon)) {
      return h(SmyIcon, { props: { name: icon, size } })
    }
    return null
  },
}

export default {
  name,
  mixins: [createProxiedModel('show', 'internalShow', { passive: true, event: 'update:show' }), SlotsMixin],
  components: { SmyPopup, SmyLoading, ToastIcon },
  props,
  data: () => ({
    timer: null,
  }),
  computed: {
    hasIcon({ icon, type }) {
      return hasSlot(this, 'icon') || icon || ['loading'].includes(type)
    },
    toastClass({ position, wordBreak, type, icon, iconPosition, hasIcon }) {
      return bem([
        position,
        wordBreak === 'normal' ? 'break-normal' : wordBreak,
        {
          [`icon-${iconPosition}`]: hasIcon && iconPosition,
          [type]: !icon && type,
        },
      ])
    },
    toastPopupClass({ type, forbidClick }) {
      const isForbidClick = type === 'loading' || forbidClick
      return bem('popup', {
        unclickable: isForbidClick,
      })
    },
    popupProps() {
      return pick(this.$props, popupInheritProps)
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
  },
  methods: {
    onClick() {
      if (!this.closeOnClick) return
      this.$emit('update:show', false)
    },
    updateAfterDuration() {
      this.timer = setTimeout(() => {
        this.$emit('update:show', false)
      }, this.duration)
    },
  },
}
</script>

<style lang="less">
@import '../popup/popup.less';
@import './toast.less';
</style>
