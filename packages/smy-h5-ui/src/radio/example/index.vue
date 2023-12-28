<template>
  <div class="demo-radio">
    <app-demo-title>基础使用</app-demo-title>
    <basic-example />
    <app-demo-title>禁用状态</app-demo-title>
    <disabled-example />
    <app-demo-title>自定义形状</app-demo-title>
    <shape-example />
    <app-demo-title>自定义颜色</app-demo-title>
    <color-example />
    <app-demo-title>自定义大小</app-demo-title>
    <size-example />
  </div>
</template>

<script>
import { AppDemoTitle } from '@smy-h5/cli/client'
import BasicExample from './BasicExample.vue'
import DisabledExample from './DisabledExample.vue'
import ShapeExample from './ShapeExample.vue'
import ColorExample from './ColorExample.vue'
import SizeExample from './SizeExample.vue'

export default {
  name: 'RadioExample',
  components: {
    AppDemoTitle,
    BasicExample,
    DisabledExample,
    ShapeExample,
    ColorExample,
    SizeExample,
  },
}
</script>

<style lang="less">
.demo-radio {
  .smy-radio {
    margin: 0 0 8px 20px;
  }
}
</style>
