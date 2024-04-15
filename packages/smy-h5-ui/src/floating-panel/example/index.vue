<template>
  <div>
    <smy-tabs>
      <smy-tab title="基础使用">
        <basic-example />
      </smy-tab>
      <smy-tab title="高度同步">
        <height-example />
      </smy-tab>
    </smy-tabs>
  </div>
</template>

<script>
import { Tabs, Tab } from '@smy-h5/ui'
import BasicExample from './BasicExample.vue'
import HeightExample from './HeightExample.vue'

export default {
  name: 'FloatingPanelExample',
  components: {
    BasicExample,
    HeightExample,
    SmyTabs: Tabs,
    SmyTab: Tab,
  },
}
</script>
