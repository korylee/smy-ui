<template>
  <div class="smy-popup-example">
    <app-demo-title>基础用法</app-demo-title>
    <smy-cell insert title="基础用法" @click="basic = true" />
    <smy-popup
      v-model:show="basic"
      :on-opened="() => popupOpened(1)"
      @opened="popupOpened(2)"
      :onOpened="() => popupOpened(3)"
      @click-overlay="popupOpened(4)"
      @clickOverlay="popupOpened(5)"
      :on-click-overlay="() => popupOpened(6)"
      :onClickOverlay="() => popupOpened(7)"
    >
      <div class="block">{{ text }}</div>
    </smy-popup>
    <app-demo-title>弹出位置</app-demo-title>
    <smy-cell insert title="下方弹出" @click="bottom = true" />
    <smy-cell insert title="上方弹出" @click="top = true" />
    <smy-cell insert title="左方弹出" @click="left = true" />
    <smy-cell insert title="右方弹出" @click="right = true" />
    <smy-popup v-model:show="bottom" position="bottom">
      <div class="block">{{ text }}</div>
    </smy-popup>
    <smy-popup v-model:show="left" position="left">
      <div class="block">{{ text }}</div>
    </smy-popup>
    <smy-popup v-model:show="top" position="top">
      <div class="block">{{ text }}</div>
    </smy-popup>
    <smy-popup v-model:show="right" position="right">
      <div class="block">{{ text }}</div>
    </smy-popup>

    <app-demo-title>注册事件</app-demo-title>
    <smy-cell insert title="注册事件" @click="event = true" />
    <smy-popup v-model:show="event" @open="popupOpen" @opened="popupOpened" @close="popupClose" @closed="popupClosed">
      <div class="block">{{ text }}</div>
    </smy-popup>

    <app-demo-title>指定挂载点</app-demo-title>
    <smy-cell insert title="指定挂载点" @click="teleport = true" />
    <smy-popup v-model:show="teleport" teleport="body">
      <div class="block">{{ text }}</div>
    </smy-popup>
  </div>
</template>

<script>
import SmyPopup from '../'
import SmyCell from '../../cell'
import { AppDemoTitle } from '@smy-h5/cli/client'

const Toast = console.log

export default {
  name: 'PopupExample',
  components: { SmyPopup, AppDemoTitle, SmyCell },
  data: () => ({
    text: '素胚勾勒出青花笔锋浓转淡, 瓶身描绘的牡丹一如你初妆, 冉冉檀香透过窗心事我了然, 宣纸上走笔至此搁一半。',
    basic: false,
    top: false,
    bottom: false,
    left: false,
    right: false,
    event: false,
    teleport: false,
  }),
  methods: {
    popupOpen() {
      Toast('open')
    },
    popupOpened(text) {
      Toast('opened', text)
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

.smy-cell {
  margin: 4px 8px;
}
</style>
