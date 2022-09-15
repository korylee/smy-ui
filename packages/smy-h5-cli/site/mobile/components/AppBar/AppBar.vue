<template>
  <div class="smy-site-app-bar">
    <div class="smy-site-app-bar__left">
      <slot name="left"/>
    </div>
    <div class="smy-site-app-bar__title"></div>
    <div class="smy-site-app-bar__right">
      <slot name="right"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppBar',
  data: () => ({}),
}
</script>

<style lang="less">
@import '../../styles/common.less';
@import './appBar.less';
</style>
