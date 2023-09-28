<template>
  <div>
    <smy-cell insert title="基础用法" @click="basic = true" />
    <smy-popup :show.sync="basic">
      <div class="block">
        素胚勾勒出青花笔锋浓转淡, 瓶身描绘的牡丹一如你初妆, 冉冉檀香透过窗心事我了然, 宣纸上走笔至此搁一半。
      </div>
    </smy-popup>
  </div>
</template>

<script>
import { Popup as SmyPopup, Cell as SmyCell } from '@smy-h5/ui'

export default {
  components: { SmyPopup, SmyCell },
  data: () => ({
    basic: false,
  }),
}
</script>

<style lang="less" scoped>
.block {
  padding: 20px 24px;
  width: 250px;
}
</style>
