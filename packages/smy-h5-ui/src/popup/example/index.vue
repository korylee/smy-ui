<template>
  <div class="smy-popup-example">
    <app-demo-title>基础用法</app-demo-title>
    <smy-cell insert title="基础用法" @click="basic = true" />
    <smy-popup :show.sync="basic">
      <div class="block">{{ text }}</div>
    </smy-popup>
    <app-demo-title>弹出位置</app-demo-title>
    <smy-cell insert title="下方弹出" @click="bottom = true" />
    <smy-cell insert title="上方弹出" @click="top = true" />
    <smy-cell insert title="左方弹出" @click="left = true" />
    <smy-cell insert title="右方弹出" @click="right = true" />
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
    <smy-cell insert title="注册事件" @click="event = true" />
    <smy-popup :show.sync="event" @open="popupOpen" @opened="popupOpened" @close="popupClose" @closed="popupClosed">
      <div class="block">{{ text }}</div>
    </smy-popup>

    <app-demo-title>指定挂载点</app-demo-title>
    <smy-cell insert title="指定挂载点" @click="teleport = true" />
    <smy-popup :show.sync="teleport" teleport="body">
      <div class="block">{{ text }}</div>
    </smy-popup>
  </div>
</template>

<script>
import Popup from '../'
import Toast from '../../toast'
import SmyCell from '../../cell'
import { AppDemoTitle } from '@smy-h5/cli/client'

export default {
  name: 'PopupExample',
  components: { [Popup.name]: Popup, AppDemoTitle, SmyCell },
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

.smy-cell {
  margin: 4px 8px;
}
</style>
