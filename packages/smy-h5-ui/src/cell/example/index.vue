<template>
  <div class="cell-example">
    <div>基础使用</div>
    <smy-cell>这里是cell组件</smy-cell>
    <div>展示描述</div>
    <smy-cell
      >这里是cell组件
      <template #desc>这里是描述</template>
    </smy-cell>
    <div>展示图标</div>
    <smy-cell
      >这里是cell组件
      <template #icon>
        <smy-icon><CloseSvg /></smy-icon>
      </template>
      <template #desc>这里是描述</template>
    </smy-cell>
    <div>右侧内容</div>
    <smy-cell
      >这里是cell组件
      <template #extra>
        <smy-icon><CloseSvg /></smy-icon>
      </template>
    </smy-cell>
    <div>点击动画</div>
    <smy-cell clickable>这里是cell组件</smy-cell>
    <div>卡片样式</div>
    <smy-cell insert class="insert-example"
      >这里是cell组件
      <template #extra>
        <smy-icon><CloseSvg /></smy-icon>
      </template>
    </smy-cell>
    <div>分组用法</div>
    <smy-cell-group>
      <smy-cell v-for="item of 3" :key="item" border clickable
        >这里是cell组件
        <template #desc>这里是描述</template>
        <template #extra>
          <smy-icon><CloseSvg /></smy-icon>
        </template>
      </smy-cell>
    </smy-cell-group>
    <div>分组卡片样式</div>
    <smy-cell-group insert class="insert-example">
      <smy-cell v-for="item of 3" :key="item" border clickable
        >这里是cell组件
        <template #desc>这里是描述</template>
        <template #extra>
          <smy-icon><CloseSvg /></smy-icon>
        </template>
      </smy-cell>
    </smy-cell-group>
  </div>
</template>

<script>
import Cell from '../'
import Icon from '../../icon'
import CellGroup from '../../cell-group'
import CloseSvg from '../../_icon/CloseSvg.vue'

export default {
  name: 'CellExample',
  components: { [Cell.name]: Cell, [CellGroup.name]: CellGroup, [Icon.name]: Icon, CloseSvg },
}
</script>

<style lang="less" scoped>
.cell-example {
  background-color: #f7f8fa;
  height: 100%;
}
.insert-example {
  margin: 10px 10px;
}
</style>
