<template>
  <div class="smy-left-slip" ref="slipItem">
    <div class="smy-left-slip__content">
      <slot></slot>
    </div>
    <div class="smy-left-slip__btns" ref="right">
      <slot name="btns"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SmyLeftSlip',
  props: {},
  data: () => ({}),
}
</script>

<style lang="less">
@import './leftSlip.less';
</style>
