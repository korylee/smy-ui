<template>
  <div class="smy-site-app-bar">
    <div class="smy-site-app-bar__left">
      <slot name="left" />
    </div>
    <div v-if="title" class="smy-site-app-bar__title">{{ title }}</div>
    <div class="smy-site-app-bar__right">
      <slot name="right" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppBar',
  props: { title: String },
  data: () => ({}),
}
</script>

<style lang="less">
@import './appBar.less';
</style>
