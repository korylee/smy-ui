<template>
  <div>
    <smy-badge value="200"> <span class="title">右上</span> </smy-badge>
    <smy-badge value="200" position="bottom-right"> <span class="title">右下</span> </smy-badge>
    <smy-badge value="200" position="top-left"> <span class="title">左上</span> </smy-badge>
    <smy-badge value="200" position="bottom-left"> <span class="title">左下</span> </smy-badge>
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
