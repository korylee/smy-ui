# Popup 弹出层

### 介绍

创建一个可以从上，下，左，右，中心弹出的容器，用于展示信息。默认使用`teleport`插入到`body`尾部

### 引入

```js
import Vue from 'vue'
import { Popup } from '@smy-h5/ui'

Vue.use(Popup)
```

### 基础使用

```demo
import BasicExample from '../example/BasicExample.vue'
```

### 弹出位置

```demo
import PositionExample from '../example/PositionExample.vue'
```

### 注册事件

```html
<template>
  <div>
    <button @click="event = true">注册事件</button>
    <smy-popup :show.sync="event" @open="popupOpen" @opened="popupOpened" @close="popupClose" @closed="popupClosed">
      <div class="block">{{ text }}</div>
    </smy-popup>
  </div>
</template>
<script>
  import { Toast } from '@smy-h5/ui'

  export default {
    data: () => ({
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
  .block {
    padding: 20px 24px;
    width: 250px;
  }
</style>
```

## API

### 属性

| 参数                     | 说明                                                   | 类型                  | 默认值   |
| ------------------------ | ------------------------------------------------------ | --------------------- | -------- |
| `show.sync`              | 是否显示弹出层                                         | _boolean_             | `false`  |
| `position`               | 弹出位置（`top`,`bottom`,`right`,`left`,`center`)      | _string_              | `center` |
| `overlay`                | 是否显示遮罩层                                         | _boolean_             | `true`   |
| `overlay-class`          | 自定义遮罩层的 class                                   | _string_              | `-`      |
| `transition`             | 过渡动画的名称                                         | _string_              | `-`      |
| `lock-scroll`            | 是否禁止滚动穿透，禁止时滚动弹出层不会触发 body 的滚动 | _boolean_             | `true`   |
| `close-on-click-overlay` | 是否点击遮罩层关闭                                     | _boolean_             | `true`   |
| `teleport`               | 弹出层挂载的位置                                       | _TeleportProps['to']_ | `-`      |

### 事件

| 事件名          | 说明                     | 参数 |
| --------------- | ------------------------ | ---- |
| `open`          | 打开弹出层触发           | `-`  |
| `opened`        | 打开弹出层动画结束时触发 | `-`  |
| `close`         | 关闭弹出层触发           | `-`  |
| `closeed`       | 关闭弹出层动画结束时触发 | `-`  |
| `click-overlay` | 点击遮罩时触发           | `-`  |

### 插槽

| 插槽名    | 说明       | 参数 |
| --------- | ---------- | ---- |
| `default` | 弹出层内容 | `-`  |

### 样式变量

以下未组件使用的 css 变量，可以使用 ConfigProvider 组件进行样式定制

| 变量名                             | 默认值                |
| ---------------------------------- | --------------------- |
| `--popup-overlay-background-color` | `rgba(0, 0, 0, 0.6);` |
| `--popup-content-background-color` | `#fff`                |
