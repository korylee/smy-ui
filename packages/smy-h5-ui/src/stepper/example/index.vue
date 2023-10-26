<template>
  <div>
    <app-demo-title>基础用法</app-demo-title>
    <basic-example />
    <app-demo-title>步长设置</app-demo-title>
    <step-example />
    <app-demo-title>限制输入范围</app-demo-title>
    <limit-example />
    <app-demo-title>禁用操作</app-demo-title>
    <disabled-example />
    <app-demo-title>只读禁用输入框</app-demo-title>
    <readonly-example />
    <app-demo-title>支持小数</app-demo-title>
    <decimal-example />
    <app-demo-title>自定义按钮大小</app-demo-title>
    <custom-size-example />
    <app-demo-title>自定义按钮</app-demo-title>
    <button-example />
  </div>
</template>

<script>
import { AppDemoTitle } from '@smy-h5/cli/client'
import BasicExample from './BasicExample.vue'
import StepExample from './StepExample.vue'
import LimitExample from './LimitExample.vue'
import DisabledExample from './DisabledExample.vue'
import ReadonlyExample from './ReadonlyExample.vue'
import DecimalExample from './DecimalExample.vue'
import CustomSizeExample from './CustomSizeExample.vue'
import ButtonExample from './ButtonExample.vue'

export default {
  name: 'StepperExample',
  components: {
    AppDemoTitle,
    BasicExample,
    StepExample,
    LimitExample,
    DisabledExample,
    ReadonlyExample,
    DecimalExample,
    CustomSizeExample,
    ButtonExample,
  },
}
</script>

<style></style>
