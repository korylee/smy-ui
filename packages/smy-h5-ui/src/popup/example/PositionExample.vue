<template>
  <div>
    <smy-cell insert title="上方弹出" @click="position = 'top'" />
    <smy-cell insert title="下方弹出" @click="position = 'bottom'" />
    <smy-cell insert title="左方弹出" @click="position = 'left'" />
    <smy-cell insert title="右方弹出" @click="position = 'right'" />
    <smy-popup :show.sync="positionShow" :position="position">
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
    text: '素胚勾勒出青花笔锋浓转淡, 瓶身描绘的牡丹一如你初妆, 冉冉檀香透过窗心事我了然, 宣纸上走笔至此搁一半。',
    position: undefined,
  }),
  computed: {
    positionShow: {
      get() {
        return !!this.position
      },
      set(val) {
        if (val) return
        this.position = undefined
      },
    },
  },
}
</script>
<style lang="less" scoped>
.block {
  padding: 20px 24px;
  width: 250px;
}
.smy-cell {
  margin: 4px 8px;
}
</style>
