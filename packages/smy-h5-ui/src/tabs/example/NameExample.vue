<template>
  <smy-tabs :active.sync="activeName">
    <smy-tab v-for="item of ['a', 'b', 'c']" :key="item" :title="'标签' + item" :name="item"> 内容{{ item }}</smy-tab>
  </smy-tabs>
</template>

<script>
import { Tabs as SmyTabs, Tab as SmyTab } from '@smy-h5/ui'

export default {
  components: { SmyTabs, SmyTab },
  data: () => ({
    activeName: 'b',
  }),
}
</script>
