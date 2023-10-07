<template>
  <div class="smy-popup-example">
    <app-demo-title>基础用法</app-demo-title>
    <basic-example />

    <app-demo-title>弹出位置</app-demo-title>
    <position-example />

    <app-demo-title>注册事件</app-demo-title>
    <event-example />

    <app-demo-title>指定挂载点</app-demo-title>
    <teleport-example />
  </div>
</template>

<script>
import { AppDemoTitle } from '@smy-h5/cli/client'
import BasicExample from './BasicExample.vue'
import PositionExample from './PositionExample.vue'
import EventExample from './EventExample.vue'
import TeleportExample from './TeleportExample.vue'

export default {
  name: 'PopupExample',
  components: {
    AppDemoTitle,
    BasicExample,
    PositionExample,
    EventExample,
    TeleportExample,
  },
}
</script>
