<template>
  <div class="smy-card">
    <slot name="image"></slot>
    <slot name="title"></slot>
    <slot name="subtitle"></slot>
    <slot name="content"></slot>
    <div class="smy-card__footer"></div>
  </div>
</template>

<script>
  export default {
    name: 'SmyCard',
  }
</script>

<style lang="less">
@import "../_styles/common.less";
@import "./card.less";
</style>