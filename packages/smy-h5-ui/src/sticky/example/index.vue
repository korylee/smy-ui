<template>
  <div class="sticky-example">
    <app-demo-title>基础用法</app-demo-title>
    <smy-sticky>
      <div class="sticky-box">基础使用</div>
    </smy-sticky>
    <app-demo-title>吸顶距离</app-demo-title>
    <smy-sticky :offset-top="60">
      <div class="sticky-box" style="margin-left: 120px">基础使用</div>
    </smy-sticky>
    <app-demo-title>指定容器</app-demo-title>
    <div class="sticky-container" ref="container">
      <smy-sticky :container="() => $refs.container">
        <div class="sticky-box" style="margin-left: 240px">基础使用</div>
      </smy-sticky>
    </div>
  </div>
</template>

<script>
import SmySticky from '../'
import { AppDemoTitle } from '@smy-h5/cli/client'

export default {
  name: 'StickyExample',
  components: { SmySticky, AppDemoTitle },
}
</script>

<style lang="less" scoped>
.sticky-example {
  height: 200vh;
  overflow: hidden;
}
.sticky-box {
  width: 120px;
  text-align: center;
  height: 40px;
  line-height: 40px;
  background: #3498db;
  color: #fff;
  border-radius: 4px;
}
.sticky-container {
  height: 150px;
  background: #fff;
}
</style>
