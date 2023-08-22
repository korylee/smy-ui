<template>
  <div>
    <app-demo-title>基础用法</app-demo-title>
    <smy-divider></smy-divider>
    <app-demo-title>展示文本</app-demo-title>
    <smy-divider>there is divider</smy-divider>
    <app-demo-title>内容位置</app-demo-title>
    <smy-divider content-position="left">there is divider</smy-divider>
    <smy-divider content-position="right">there is divider</smy-divider>
    <app-demo-title>展示文本</app-demo-title>
    <smy-divider dashed>there is divider</smy-divider>
    <app-demo-title>垂直</app-demo-title>
    <div><smy-divider vertical /> 文本</div>
  </div>
</template>

<script>
import SmyDivider from '..'
import AppDemoTitle from '@smy-h5/cli/client/AppDemoTitle'

export default {
  name: 'DividerExample',
  components: { SmyDivider, AppDemoTitle },
}
</script>
