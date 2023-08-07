<template>
  <div>
    <app-demo-title>基础用法</app-demo-title>
    <smy-cell>
      <smy-stepper v-model="val1" />
      <template #extra> {{ val1 }}</template>
    </smy-cell>
    <app-demo-title>步长设置</app-demo-title>
    <smy-stepper model-value="0" :step="2" />
    <app-demo-title>限制输入范围</app-demo-title>
    <smy-stepper model-value="0" min="10" max="20" />
    <app-demo-title>禁用操作</app-demo-title>
    <smy-stepper disabled model-value="0" />
    <app-demo-title>只读禁用输入框</app-demo-title>
    <smy-stepper readonly model-value="0" />
    <app-demo-title>支持小数</app-demo-title>
    <smy-stepper model-value="0" step="0.1" decimal-places="1" />
    <app-demo-title>自定义按钮大小</app-demo-title>
    <smy-stepper model-value="0" step="1" width="200" height="40" button-width="40" button-size="25" />
    <app-demo-title>自定义按钮</app-demo-title>
    <smy-stepper model-value="0">
      <template #minus>
        <smy-icon><close-circle /></smy-icon>
      </template>
      <template #plus>
        <smy-icon><close-circle-outline /></smy-icon>
      </template>
    </smy-stepper>
  </div>
</template>

<script>
import { AppDemoTitle } from '@smy-h5/cli/client'
import SmyStepper from '..'
import SmyCell from '../../cell'
import SmyIcon from '../../icon'
import { CloseCircle, CloseCircleOutline } from '@smy-h5/icons'

export default {
  name: 'StepperExample',
  components: { SmyStepper, AppDemoTitle, SmyCell, SmyIcon, CloseCircle, CloseCircleOutline },
  data: () => ({
    val1: 1,
    val2: 1,
    val: 0,
  }),
  methods: {
    onEvent(name, event) {
      console.log(name, event)
    },
  },
}
</script>

<style></style>
