<template>
  <div class="switch-example">
    <h4>基本用法</h4>
    <Cell>
      <smy-switch :active.sync="active" />
      <template #extra>{{ active }}</template>
    </Cell>
    <div></div>
    <SmySwitch :active.sync="smallActive" size="10" label="开|关" />
    <SmySwitch :active.sync="largeActive" size="14" label="开|关" />
  </div>
</template>

<script>
import Cell from '../../cell'
import SmySwitch from '../Switch.vue'

export default {
  name: 'SwitchExample',
  components: { SmySwitch, Cell },
  data: () => ({
    active: false,
    smallActive: false,
    largeActive: false,
  }),
}
</script>

<style lang="less" scoped>
.switch-example {
  background: #f7f7f7;
}
.smy-cell {
  background-color: rgb(255, 255, 255);
  background-image: linear-gradient(hsla(0, 0%, 85.5%, 0.5), hsla(0, 0%, 85.5%, 0.5));
  background-size: 100% 1px;
  background-repeat: no-repeat;
  background-position: bottom;
}
</style>
