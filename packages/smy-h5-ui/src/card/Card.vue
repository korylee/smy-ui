<template>
  <div class="smy-card" @click="handleClick">
    <slot name="image">
      <img v-if="src" class="smy-card__image" :src="src" />
    </slot>
    <slot name="title">
      <div v-if="title" class="smy-card__title">{{ title }}</div>
    </slot>
    <slot name="subtitle"></slot>
    <slot name="content"></slot>
    <div v-if="hasSlots('extra')" class="smy-card__footer">
      <slot name="extra" />
    </div>
  </div>
</template>

<script>
import { props } from './props'
import { SlotsMixin } from '@smy-h5/vooks'

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
@import './card.less';
</style>
