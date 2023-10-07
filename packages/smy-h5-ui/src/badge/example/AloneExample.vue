<template>
  <div>
    <smy-badge value="8" />
    <smy-badge value="76" />
    <smy-badge value="NEW" />
    <smy-badge value="NEW" bubble />
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
</style>
