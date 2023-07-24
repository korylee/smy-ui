<template>
  <div class="sticky-example">
    <app-demo-title>基础用法</app-demo-title>
    <smy-sticky>
      <span>基础使用</span>
    </smy-sticky>
  </div>
</template>

<script>
import SmySticky from '../'
import { AppDemoTitle } from '@smy-h5/cli/client'

export default {
  name: 'StickyExample',
  components: { SmySticky, AppDemoTitle },
  methods: {},
}
</script>

<style lang="less" scoped>
.sticky-example {
  height: 200vh;
  overflow: hidden;
}
</style>
