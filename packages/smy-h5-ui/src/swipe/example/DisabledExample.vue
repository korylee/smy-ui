<template>
  <smy-swipe disabled>
    <smy-cell title="禁用滑动" insert></smy-cell>
    <template #right>
      <div class="delete-btn btn">删除</div>
    </template>
  </smy-swipe>
</template>

<script>
import { Swipe as SmySwipe, Cell as SmyCell } from '@smy-h5/ui'

export default {
  components: { SmySwipe, SmyCell },
}
</script>
