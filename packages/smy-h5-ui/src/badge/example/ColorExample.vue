<template>
  <div>
    <smy-badge value="8" color="linear-gradient(135deg, #fa2c19 0%, #fa6419 100%)">
      <span class="title">标题</span>
    </smy-badge>
    <smy-badge value="76" color="linear-gradient(135deg, #fa2c19 0%, #fa6419 100%)">
      <span class="title">标题</span>
    </smy-badge>
    <smy-badge value="NEW" color="linear-gradient(135deg, #fa2c19 0%, #fa6419 100%)">
      <span class="title">标题</span>
    </smy-badge>
    <smy-badge value="NEW" bubble color="linear-gradient(135deg, #fa2c19 0%, #fa6419 100%)">
      <span class="title">标题</span>
    </smy-badge>
    <smy-badge value="NEW" dot color="linear-gradient(135deg, #fa2c19 0%, #fa6419 100%)">
      <span class="title">标题</span>
    </smy-badge>
  </div>
</template>

<script>
import { Badge as SmyBadge } from '@smy-h5/ui'

export default {
  components: { SmyBadge },
}
</script>

<style lang="less" scope>
.smy-badge {
  &:not(:first-child) {
    margin-left: 30px;
  }
  &:first-child {
    margin-left: 10px;
  }
}
.title {
  display: inline-block;
  font-size: 14px;
  line-height: 40px;
  width: 40px;
  height: 40px;
  background: rgb(238, 238, 238);
  color: rgb(102, 102, 102);
  text-align: center;
  border-radius: 3px;
}
</style>
