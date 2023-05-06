<template>
  <div class="switch-example">
    <app-demo-title>基本用法</app-demo-title>
    <smy-cell>
      <smy-switch v-model="active" />
      <template #extra>{{ active }}</template>
    </smy-cell>
    <app-demo-title>自定义值</app-demo-title>
    <smy-cell>
      <smy-switch v-model="valueActive" active-value="hello" inactive-value="goodbye" />
      <template #extra>{{ valueActive }}</template>
    </smy-cell>
    <app-demo-title>禁用</app-demo-title>
    <smy-cell>
      <smy-switch :value="true" disabled />
      <smy-switch :value="false" disabled />
    </smy-cell>
    <app-demo-title>加载中</app-demo-title>
    <smy-cell>
      <smy-switch v-model="loadingActive" loading />
    </smy-cell>
    <app-demo-title>任意尺寸</app-demo-title>
    <smy-cell>
      <smy-switch v-model="sizeActive" size="12" />
      <smy-switch v-model="sizeActive" size="16" />
      <smy-switch v-model="sizeActive" size="20" />
      <smy-switch v-model="sizeActive" size="26" />
      <smy-switch v-model="sizeActive" size="32" />
    </smy-cell>
    <app-demo-title>自定义颜色</app-demo-title>
    <smy-cell>
      <smy-switch v-model="colorActive" inactive-color="pink" active-color="blue" />
    </smy-cell>
    <app-demo-title>支持文字</app-demo-title>
    <smy-cell>
      <smy-switch v-model="labelActive" inactive-label="关" active-label="开" />
    </smy-cell>
  </div>
</template>

<script>
import SmyCell from '../../cell'
import SmySwitch from '..'
import { AppDemoTitle } from '@smy-h5/cli/client'

export default {
  name: 'SwitchExample',
  components: { SmySwitch, SmyCell, AppDemoTitle },
  data: () => ({
    active: false,
    sizeActive: false,
    labelActive: false,
    colorActive: false,
    loadingActive: false,
    valueActive: false,
  }),
}
</script>

<style lang="less" scoped>
.switch-example {
  background: #f7f7f7;
  // height: 100vh;
}
</style>
