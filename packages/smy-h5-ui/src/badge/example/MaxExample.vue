<template>
  <div>
    <smy-badge value="200" max="9"> <span class="title">标题</span> </smy-badge>
    <smy-badge value="200" max="20"> <span class="title">标题</span> </smy-badge>
    <smy-badge value="200" max="99"> <span class="title">标题</span> </smy-badge>
  </div>
</template>

<script>
import { Badge as SmyBadge } from '@smy-h5/ui'

export default {
  name: 'BadgeExample',
  components: { SmyBadge },
  data: () => ({
    hidden: false,
  }),
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
</style>
