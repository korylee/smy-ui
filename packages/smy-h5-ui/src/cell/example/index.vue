<template>
  <div>
    <div>基础使用</div>
    <Cell>这里是cell组件</Cell>
    <div>展示描述</div>
    <Cell
      >这里是cell组件
      <template #desc>这里是描述</template>
    </Cell>
    <div>展示图标</div>
    <Cell
      >这里是cell组件
      <template #icon>
        <Icon><CloseSvg /></Icon>
      </template>
    </Cell>
    <Cell
      >这里是cell组件
      <template #extra>
        <Icon><CloseSvg /></Icon>
      </template>
    </Cell>
  </div>
</template>

<script>
import Cell from '../'
import Icon from '../../icon'
import CloseSvg from '../../_icon/CloseSvg.vue'

export default {
  name: 'CellExample',
  components: { Cell, Icon, CloseSvg },
}
</script>

<style></style>
