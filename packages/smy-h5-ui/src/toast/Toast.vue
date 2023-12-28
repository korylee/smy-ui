<template>
  <smy-popup
    :show="show"
    :content-class="toastClass"
    :wrapper-class="bem('popup', { unclickable: type === 'loading' || forbidClick })"
    smy-toast-cover
    @click="onClick"
    v-bind="popupProps"
    v-on="popupListeners"
  >
    <div v-if="hasIcon" :class="bem('icon')">
      <slot name="icon">
        <smy-icon v-if="icon" :name="icon" :size="iconSize" />
        <smy-loading v-else-if="type === 'loading'" :type="loadingType" :size="iconSize" />
      </slot>
    </div>
    <div v-if="hasContent" :class="[bem('content'), contentClass]">
      <slot> <span v-html="content"></span> </slot>
    </div>
    <button type="button"></button>
  </smy-popup>
</template>

<script>
import SmyPopup from '../popup'
import SmyLoading from '../loading'
import SmyIcon from '../icon'
import { props, popupInheritProps } from './props'
import { SlotsMixin } from '../_utils/vue/slots'
import { pick } from '../_utils/shared'
import { createNamespace } from '../_utils/vue/create'
import { getListeners } from '../_mixins/listeners'
import { popupListeners } from '../popup/shared'

const [name, bem] = createNamespace('toast')

export default {
  name,
  mixins: [SlotsMixin],
  components: { SmyPopup, SmyLoading, SmyIcon },
  props,
  data: () => ({
    timer: null,
  }),
  computed: {
    hasIcon({ icon, type }) {
      return this.hasSlot('icon') || icon || ['loading'].includes(type)
    },
    hasContent({ content }) {
      return content || this.hasSlot()
    },
    toastClass({ position, wordBreak, type, icon, iconPosition, hasIcon, hasContent }) {
      return bem([
        position,
        wordBreak === 'normal' ? 'break-normal' : wordBreak,
        {
          [`icon-${hasContent ? iconPosition : 'center'}`]: hasIcon && iconPosition,
          [type]: !icon && type,
        },
      ])
    },
    popupProps() {
      return pick(this.$props, popupInheritProps)
    },
    popupListeners() {
      return getListeners.call(this, popupListeners)
    },
  },
  watch: {
    show: {
      immediate: true,
      handler: 'updateAfterDuration',
    },
    duration: 'updateAfterDuration',
  },
  methods: {
    bem,
    onClick() {
      if (!this.closeOnClick) return
      this.$emit('update:show', false)
    },
    updateAfterDuration() {
      const { duration, show } = this
      clearTimeout(this.timer)
      if (show && duration > 0) {
        this.timer = setTimeout(() => {
          this.$emit('update:show', false)
        }, duration)
      }
    },
  },
}
</script>

<style lang="less">
@import '../popup/popup.less';
@import './toast.less';
</style>
