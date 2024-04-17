<template>
  <div class="tabs-example">
    <app-demo-title>基础使用</app-demo-title>
    <basic-example />
    <app-demo-title>通过名称匹配</app-demo-title>
    <name-example />
    <app-demo-title>标签栏滚动</app-demo-title>
    <scroll-example />
    <app-demo-title>点击事件</app-demo-title>
    <click-example />
    <app-demo-title>收缩布局</app-demo-title>
    <shrink-example />
    <app-demo-title>粘滞定位</app-demo-title>
    <sticky-example />
    <app-demo-title>自定义标签</app-demo-title>
    <custom-tag-example />
    <app-demo-title>切换动画</app-demo-title>
    <animated-example />
    <app-demo-title>滑动切换</app-demo-title>
    <swipe-example />
    <app-demo-title>滚动导航</app-demo-title>
    <scrollspy-example />
  </div>
</template>

<script>
import { AppDemoTitle } from '@smy-h5/cli/client'
import BasicExample from './BasicExample.vue'
import NameExample from './NameExample.vue'
import ScrollExample from './ScrollExample.vue'
import ClickExample from './ClickExample.vue'
import ShrinkExample from './ShrinkExample.vue'
import StickyExample from './StickyExample.vue'
import AnimatedExample from './AnimatedExample.vue'
import SwipeExample from './SwipeExample.vue'
import ScrollspyExample from './ScrollspyExample.vue'
import CustomTagExample from './CustomTagExample.vue'

export default {
  name: 'TabsExample',
  components: {
    AppDemoTitle,
    BasicExample,
    NameExample,
    ScrollExample,
    ClickExample,
    ShrinkExample,
    StickyExample,
    AnimatedExample,
    SwipeExample,
    ScrollspyExample,
    CustomTagExample,
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
