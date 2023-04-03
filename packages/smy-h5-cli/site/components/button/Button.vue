<template>
  <button class="smy-site-button" :class="{
    'smy-site-button--text': text,
    'smy-site-button--round': round,
    'smy-site-button--outline': outline,
  }" @click="handleClick">
    <div class="smy-site-button__content">
      <slot />
    </div>
  </button>
</template>
<script>
import { props } from './props'

export default {
  name: 'SmySiteButton',
  props,
  methods: {
    handleClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="less">
@import "./button.less";
</style>
