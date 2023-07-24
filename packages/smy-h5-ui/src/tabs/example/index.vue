<template>
  <div>
    <app-demo-title>基础使用</app-demo-title>
    <smy-tabs swipeable>
      <smy-tab title="test"> 内容 </smy-tab>
      <smy-tab title="test2"> 内容2 </smy-tab>
    </smy-tabs>
  </div>
</template>

<script>
import { AppDemoTitle } from '@smy-h5/cli/client'
import SmyTabs from '..'
import SmyTab from '../../tab'

export default {
  name: 'TabsExample',
  components: { SmyTabs, SmyTab, AppDemoTitle },
}
</script>
