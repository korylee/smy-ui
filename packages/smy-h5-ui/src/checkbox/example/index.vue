<template>
  <div class="demo-checkbox">
    <app-demo-title>基础用法</app-demo-title>
    <smy-checkbox v-model="checked" />
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
    <app-demo-title>不确定状态</app-demo-title>
    <smy-checkbox indeterminate />
  </div>
</template>

<script>
import { AppDemoTitle } from '@smy-h5/cli/client'
import Checkbox from '../'
import SizeExample from './SizeExample.vue'
import ShapeExample from './ShapeExample.vue'
import ColorExample from './ColorExample.vue'
import IconExample from './IconExample.vue'
import DisabledExample from './DisabledExample.vue'

export default {
  name: 'CheckboxExample',
  components: {
    SmyCheckbox: Checkbox,
    AppDemoTitle,
    SizeExample,
    DisabledExample,
    ShapeExample,
    ColorExample,
    IconExample,
  },
  data: () => ({
    checked: false,
  }),
}
</script>
