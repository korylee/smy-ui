<template>
  <smy-tabs :active.sync="activeTab">
    <smy-tab title="基础使用">
      <smy-cell v-for="item of 50" :key="item" :title="item" />
      <back-top v-if="activeTab === 0" />
    </smy-tab>
    <smy-tab title="自定义位置">
      <smy-cell v-for="item of 50" :key="item" :title="item" />
      <back-top v-if="activeTab === 1" right="15vw" bottom="10vh" />
    </smy-tab>
    <smy-tab title="自定义内容">
      <smy-cell v-for="item of 50" :key="item" :title="item" />
      <back-top v-if="activeTab === 2"> 返回顶部 </back-top>
    </smy-tab>
  </smy-tabs>
</template>

<script>
import BackTop from '..'
import SmyCell from '../../cell'
import SmyTabs from '../../tabs'
import SmyTab from '../../tab'

export default {
  name: 'BackTopExample',
  components: { BackTop, SmyCell, SmyTabs, SmyTab },
  data: () => ({
    activeTab: 0,
  }),
}
</script>
