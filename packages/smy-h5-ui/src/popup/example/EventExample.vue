<template>
  <div>
    <smy-cell insert title="注册事件" @click="show = true" />
    <smy-popup :show.sync="show" @open="popupOpen" @opened="popupOpened" @close="popupClose" @closed="popupClosed">
      <div class="block">
        素胚勾勒出青花笔锋浓转淡, 瓶身描绘的牡丹一如你初妆, 冉冉檀香透过窗心事我了然, 宣纸上走笔至此搁一半。
      </div>
    </smy-popup>
  </div>
</template>

<script lang="ts">
import { Popup as SmyPopup, Cell as SmyCell, Toast } from '@smy-h5/ui'

export default {
  components: { SmyPopup, SmyCell },
  data: () => ({
    show: false,
  }),
  methods: {
    popupOpen() {
      Toast('open')
    },
    popupOpened() {
      Toast('opened')
    },
    popupClose() {
      Toast('close')
    },
    popupClosed() {
      Toast('closed')
    },
  },
}
</script>

<style lang="less" scoped>
.block {
  padding: 20px 24px;
  width: 250px;
}
</style>
