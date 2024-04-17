<template>
  <smy-tabs>
    <smy-tab v-for="item of 8" :key="item" :title="'标签' + item"> 内容 {{ item }} </smy-tab>
  </smy-tabs>
</template>

<script>
import { Tabs as SmyTabs, Tab as SmyTab } from '@smy-h5/ui'

export default {
  components: { SmyTabs, SmyTab },
}
</script>
