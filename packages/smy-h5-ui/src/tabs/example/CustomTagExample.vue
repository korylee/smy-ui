<template>
  <smy-tabs>
    <smy-tab v-for="item of 4" :key="item" :title="'标签' + item">
      <template #title>test 标签</template>
      内容 {{ item }}
    </smy-tab>
  </smy-tabs>
</template>

<script>
import { Tabs as SmyTabs, Tab as SmyTab } from '@smy-h5/ui'

export default {
  components: { SmyTabs, SmyTab },
}
</script>
