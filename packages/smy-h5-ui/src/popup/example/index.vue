<template>
  <div class="smy-popup-example">
    <app-demo-title>弹出位置</app-demo-title>
    <button @click="center = true">居中弹出</button>
    <button @click="bottom = true">下方弹出</button>
    <button @click="top = true">上方弹出</button>
    <button @click="left = true">左方弹出</button>
    <button @click="right = true">右方弹出</button>

    <smy-popup :show.sync="center">
      <div class="block">{{ text }}</div>
    </smy-popup>
    <smy-popup :show.sync="bottom" position="bottom">
      <div class="block">{{ text }}</div>
    </smy-popup>
    <smy-popup :show.sync="left" position="left">
      <div class="block">{{ text }}</div>
    </smy-popup>
    <smy-popup :show.sync="top" position="top">
      <div class="block">{{ text }}</div>
    </smy-popup>
    <smy-popup :show.sync="right" position="right">
      <div class="block">{{ text }}</div>
    </smy-popup>

    <app-demo-title>注册事件</app-demo-title>
    <button @click="event = true">注册事件</button>
    <smy-popup :show.sync="event" @open="popupOpen" @opened="popupOpened" @close="popupClose" @closed="popupClosed">
      <div class="block">{{ text }}</div>
    </smy-popup>
  </div>
</template>

<script>
import Popup from '../'
import Toast from '../../toast'
import { AppDemoTitle } from '@smy-h5/cli/client'

export default {
  name: 'PopupExample',
  components: { [Popup.name]: Popup, AppDemoTitle },
  data: () => ({
    text: '素胚勾勒出青花笔锋浓转淡, 瓶身描绘的牡丹一如你初妆, 冉冉檀香透过窗心事我了然, 宣纸上走笔至此搁一半。',
    center: false,
    top: false,
    bottom: false,
    left: false,
    right: false,
    event: false,
  }),
  methods: {
    popupOpen() {
      Toast.info('open')
    },
    popupOpened() {
      Toast.success('opened')
    },
    popupClose() {
      Toast.warning('close')
    },
    popupClosed() {
      Toast.error('closed')
    },
  },
}
</script>

<style lang="less" scoped>
.smy-popup-example {
  .block {
    padding: 20px 24px;
    width: 250px;
  }
}
</style>
