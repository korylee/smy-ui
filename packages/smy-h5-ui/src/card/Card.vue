<template>
  <div class="smy-card" :class="`smy-elevation--${elevation || 2}`" @click="handleClick">
    <slot name="image">
      <img v-if="src" class="smy-card__image" :src="src" :alt="alt" :style="{ objectFit: fit, height: height }" />
    </slot>
    <slot name="title">
      <div v-if="title" class="smy-card__title">{{ title }}</div>
    </slot>
    <slot name="subtitle">
      <div v-if="subtitle" class="smy-card__subtitle">{{ subtitle }}</div>
    </slot>
    <slot name="content">
      <div v-if="content" class="smy-card__content">{{ content }}</div>
    </slot>
    <div v-if="hasSlots('footer')" class="smy-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
import { props } from './props'
import { SlotsMixin } from '../_utils/vue/slots'

export default {
  name: 'SmyCard',
  mixins: [SlotsMixin],
  props,
  methods: {
    handleClick(e) {
      const { disabled } = this
      if (disabled) return
      this.$listeners.click?.(e)
    },
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
@import '../_styles/elevation.less';
@import './card.less';
</style>
