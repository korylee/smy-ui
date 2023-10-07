<template>
  <div>
    <smy-badge>
      <span class="title">标题</span>
      <template #icon>
        <smy-icon><xml /></smy-icon>
      </template>
    </smy-badge>
  </div>
</template>

<script>
import { Badge as SmyBadge, Icon as SmyIcon } from '@smy-h5/ui'
import { Xml } from '@smy-h5/icons'

export default {
  components: { SmyBadge, Xml, SmyIcon },
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
