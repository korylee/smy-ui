<template>
  <smy-tabs @click-tab="onClickTab">
    <smy-tab v-for="item of 3" :key="item" :title="'标签' + item"> 内容 {{ item }} </smy-tab>
  </smy-tabs>
</template>

<script>
import { Tabs as SmyTabs, Tab as SmyTab, Toast as SmyToast } from '@smy-h5/ui'

export default {
  components: { SmyTabs, SmyTab },
  methods: {
    onClickTab({ title }) {
      SmyToast(title)
    },
  },
}
</script>
