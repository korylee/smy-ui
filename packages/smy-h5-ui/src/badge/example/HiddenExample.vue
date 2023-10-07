<template>
  <div>
    <smy-badge :hidden="hidden" value="8">
      <span class="title" @click="hidden = !hidden">标题</span>
    </smy-badge>
  </div>
</template>

<script>
import { Badge as SmyBadge } from '@smy-h5/ui'

export default {
  components: { SmyBadge },
  data: () => ({
    hidden: false,
  }),
}
</script>

<style lang="less" scope>
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
