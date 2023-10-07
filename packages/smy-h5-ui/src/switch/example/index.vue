<template>
  <div class="switch-example">
    <app-demo-title>基本用法</app-demo-title>
    <basic-example />

    <app-demo-title>自定义值</app-demo-title>
    <custom-example />

    <app-demo-title>禁用</app-demo-title>

    <disabled-example />
    <app-demo-title>加载中</app-demo-title>
    <loading-example />

    <app-demo-title>任意尺寸</app-demo-title>
    <size-example />

    <app-demo-title>自定义颜色</app-demo-title>
    <color-example />

    <app-demo-title>支持文字</app-demo-title>
    <text-example />
  </div>
</template>

<script>
import { AppDemoTitle } from '@smy-h5/cli/client'
import BasicExample from './BasicExample.vue'
import CustomExample from './CustomExample.vue'
import DisabledExample from './DisabledExample.vue'
import LoadingExample from './LoadingExample.vue'
import SizeExample from './SizeExample.vue'
import ColorExample from './ColorExample.vue'
import TextExample from './TextExample.vue'

export default {
  name: 'SwitchExample',
  components: {
    AppDemoTitle,
    BasicExample,
    CustomExample,
    DisabledExample,
    LoadingExample,
    SizeExample,
    ColorExample,
    TextExample,
  },
}
</script>

<style lang="less" scoped>
.switch-example {
  background: #f7f7f7;
}
</style>
