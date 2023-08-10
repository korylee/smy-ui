<template>
  <div class="cell-example">
    <app-demo-title>基础使用</app-demo-title>
    <smy-cell>这里是cell组件</smy-cell>
    <app-demo-title>展示描述</app-demo-title>
    <smy-cell
      >这里是cell组件
      <template #desc>这里是描述</template>
    </smy-cell>
    <app-demo-title>展示图标</app-demo-title>
    <smy-cell
      >这里是cell组件
      <template #icon>
        <smy-icon><window-close /></smy-icon>
      </template>
      <template #desc>这里是描述</template>
    </smy-cell>
    <app-demo-title>右侧内容</app-demo-title>
    <smy-cell
      >这里是cell组件
      <template #extra>
        <smy-icon><window-close /></smy-icon>
      </template>
    </smy-cell>
    <app-demo-title>点击动画</app-demo-title>
    <smy-cell clickable>这里是cell组件</smy-cell>
    <app-demo-title>卡片样式</app-demo-title>
    <smy-cell insert class="insert-example"
      >这里是cell组件
      <template #extra>
        <smy-icon><window-close /></smy-icon>
      </template>
    </smy-cell>
    <app-demo-title>分组用法</app-demo-title>
    <smy-cell-group>
      <smy-cell v-for="item of 3" :key="item" border clickable
        >这里是cell组件
        <template #desc>这里是描述</template>
        <template #extra>
          <smy-icon><window-close /></smy-icon>
        </template>
      </smy-cell>
    </smy-cell-group>
    <app-demo-title>分组卡片样式</app-demo-title>
    <smy-cell-group insert class="insert-example">
      <smy-cell v-for="item of 3" :key="item" border clickable
        >这里是cell组件
        <template #desc>这里是描述</template>
        <template #extra>
          <smy-icon><window-close /></smy-icon>
        </template>
      </smy-cell>
    </smy-cell-group>
    <test-popup show :overlay-style="{color: 'red'}" />
  </div>
</template>

<script>
import Cell from '../'
import Icon from '../../icon'
import CellGroup from '../../cell-group'
import { WindowClose } from '@smy-h5/icons'
import TestPopup from '../../popup/Popup.tsx'
import { AppDemoTitle } from '@smy-h5/cli/client'

export default {
  name: 'CellExample',
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Icon.name]: Icon,
    WindowClose,
    AppDemoTitle,
    TestPopup,
  },
}
</script>

<style lang="less" scoped>
.cell-example {
  background-color: #f7f8fa;
  height: 100%;
}
.insert-example {
  margin: 0 10px;
}
</style>
