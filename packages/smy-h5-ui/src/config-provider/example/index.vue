<template>
  <div class="smy-config-provider-example">
    <app-demo-title>默认主题</app-demo-title>
    <config-provider>
      <smy-tag>12151</smy-tag>
      <smy-tag type="primary">12151</smy-tag>
      <smy-tag type="success">12151</smy-tag>
      <smy-tag type="warning">12151</smy-tag>
      <smy-tag type="danger">12151</smy-tag>
    </config-provider>
    <app-demo-title>定制主题</app-demo-title>
    <config-provider :styleVars="themeVars">
      <smy-tag>12151</smy-tag>
      <smy-tag type="primary">12151</smy-tag>
      <smy-tag type="success">12151</smy-tag>
      <smy-tag type="warning">12151</smy-tag>
      <smy-tag type="danger">12151</smy-tag>
    </config-provider>
  </div>
</template>

<script>
import { AppDemoTitle } from '@smy-h5/cli/client'
import ConfigProvider from '../ConfigProvider.vue'
import { Tag as SmyTag } from '@smy-h5/ui'

export default {
  name: 'ConfigProviderExample',
  components: { ConfigProvider, AppDemoTitle, SmyTag },
  data: () => ({
    themeVars: {
      'tag-primary-background-color': '#47B347',
    },
  }),
}
</script>
