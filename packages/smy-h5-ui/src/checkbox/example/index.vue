<template>
  <div class="demo-checkbox">
    <app-demo-title>基础用法</app-demo-title>
    <basic-example />
    <app-demo-title>禁用状态</app-demo-title>
    <disabled-example />
    <app-demo-title>自定义形状</app-demo-title>
    <shape-example />
    <app-demo-title>自定义颜色</app-demo-title>
    <color-example />
    <app-demo-title>自定义大小</app-demo-title>
    <size-example />
    <app-demo-title>自定义图标</app-demo-title>
    <icon-example />
    <app-demo-title>复选框组</app-demo-title>
    <checkbox-group-example />
    <app-demo-title>不确定状态</app-demo-title>
    <indeterminate-example />
  </div>
</template>

<script>
import { AppDemoTitle } from '@smy-h5/cli/client'
import BasicExample from './BasicExample.vue'
import SizeExample from './SizeExample.vue'
import ShapeExample from './ShapeExample.vue'
import ColorExample from './ColorExample.vue'
import IconExample from './IconExample.vue'
import DisabledExample from './DisabledExample.vue'
import CheckboxGroupExample from './CheckboxGroupExample.vue'
import IndeterminateExample from './IndeterminateExample.vue'

export default {
  name: 'CheckboxExample',
  components: {
    AppDemoTitle,
    BasicExample,
    SizeExample,
    DisabledExample,
    ShapeExample,
    ColorExample,
    IconExample,
    CheckboxGroupExample,
    IndeterminateExample,
  },
}
</script>

<style lang="less">
.demo-checkbox {
  .smy-checkbox {
    margin: 0 0 8px 20px;
  }
}
</style>
