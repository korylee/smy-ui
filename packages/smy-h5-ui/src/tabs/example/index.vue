<template>
  <div class="tabs-example">
    <app-demo-title>基础使用</app-demo-title>
    <basic-example />
    <app-demo-title>通过名称匹配</app-demo-title>
    <smy-tabs :active.sync="activeName">
      <smy-tab v-for="item of ['a', 'b', 'c']" :key="item" :title="'标签' + item" :name="item">
        内容{{ item }}
      </smy-tab>
    </smy-tabs>
    <app-demo-title>标签栏滚动</app-demo-title>
    <smy-tabs>
      <smy-tab v-for="item of 8" :key="item" :title="'标签' + item"> 内容 {{ item }} </smy-tab>
    </smy-tabs>
    <app-demo-title>点击事件</app-demo-title>
    <smy-tabs @click-tab="clickTab">
      <smy-tab v-for="item of 3" :key="item" :title="'标签' + item"> 内容 {{ item }} </smy-tab>
    </smy-tabs>
    <app-demo-title>收缩布局</app-demo-title>
    <smy-tabs shrink>
      <smy-tab v-for="item of 4" :key="item" :title="'标签' + item"> 内容 {{ item }} </smy-tab>
    </smy-tabs>
    <app-demo-title>粘滞定位</app-demo-title>
    <smy-tabs sticky>
      <smy-tab v-for="item of 4" :key="item" :title="'标签' + item"> 内容 {{ item }} </smy-tab>
    </smy-tabs>
    <app-demo-title>自定义标签</app-demo-title>
    <smy-tabs>
      <smy-tab v-for="item of 4" :key="item" :title="'标签' + item">
        <template #title>test 标签</template>
        内容 {{ item }}
      </smy-tab>
    </smy-tabs>
    <app-demo-title>切换动画</app-demo-title>
    <smy-tabs animated>
      <smy-tab v-for="item of 4" :key="item" :title="'标签' + item"> 内容 {{ item }} </smy-tab>
    </smy-tabs>
    <app-demo-title>滑动切换</app-demo-title>
    <smy-tabs swipeable @change="onChange">
      <smy-tab v-for="item of 4" :key="item" :title="'标签' + item"> 内容 {{ item }} </smy-tab>
    </smy-tabs>
    <app-demo-title>粘滞定位</app-demo-title>
    <smy-tabs scrollspy sticky>
      <smy-tab v-for="item of 8" :key="item" :title="'标签' + item"> 内容 {{ item }} </smy-tab>
    </smy-tabs>
  </div>
</template>

<script>
import { AppDemoTitle } from '@smy-h5/cli/client'
import SmyTabs from '..'
import SmyTab from '../../tab'
import SmyToast from '../../toast'
import BasicExample from './BasicExample.vue'

export default {
  name: 'TabsExample',
  components: { SmyTabs, SmyTab, AppDemoTitle, BasicExample },
  data: () => ({
    activeName: 'b',
  }),
  methods: {
    clickTab({ title }) {
      SmyToast(title)
    },
    onChange(...args) {
      console.log(...args)
    },
  },
}
</script>

<style lang="less" scoped>
.tabs-example {
  margin-bottom: 80vh;
  overflow: unset;
  & ::v-deep .smy-tab__panel {
    padding: 24px 20px;
  }
}
</style>
