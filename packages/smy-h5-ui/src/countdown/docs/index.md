# Countdown 倒计时

### 介绍

用于实时展示倒计时数值，支持毫秒精度

### 引入

```js
import Vue from 'vue'
import { Countdown } from '@smy-h5/ui'

Vue.use(Countdown)
```

### 基本使用

```html
<template>
  <smy-countdown :time="time" />
</template>
<script>
export default {
  data: () => ({
    time: 30 * 60 * 60 * 1000,
  }),
}
</script>
```

## API

### 属性

| 参数         | 说明               | 类型               | 默认值         |
| ------------ | ------------------ | ------------------ | -------------- |
| `time`       | 倒计时时长(ms)     | _string \| number_ | `0`            |
| `format`     | 时间格式           | _string_           | `HH : mm : ss` |
| `auto-start` | 是否自动开始倒计时 | _boolean_          | `true`         |

### format 格式

| 格式  | 说明         |
| ----- | ------------ |
| `DD`  | 天数         |
| `HH`  | 小时         |
| `mm`  | 分钟         |
| `ss`  | 秒数         |
| `S`   | 毫秒（1 位） |
| `SS`  | 毫秒（2 位） |
| `SSS` | 毫秒（3 位） |

### 事件

| 事件名   | 说明             | 回调参数             |
| -------- | ---------------- | -------------------- |
| `end`    | 倒计时结束时触发 | `-`                  |
| `change` | 倒计时变化时触发 | `timeData: TimeData` |

### 插槽

| 名称      | 说明       | 参数                 |
| --------- | ---------- | -------------------- |
| `default` | 自定义内容 | `timeData: TimeData` |

### TimeData 格式

| 名称          | 说明     | 类型     |
| ------------- | -------- | -------- |
| `days`        | 剩余天数 | _number_ |
| `hours`       | 剩余小时 | _number_ |
| `minutes`     | 剩余分钟 | _number_ |
| `seconds`     | 剩余秒钟 | _number_ |
| `millseconds` | 剩余毫秒 | _number_ |

### 方法

通过`ref`可以获取到 CountDown 实例并调用实例方法

| 方法名  | 说明                                                     | 参数 |
| ------- | -------------------------------------------------------- | ---- |
| `start` | 开始倒计时                                               | `-`  |
| `pause` | 暂停始倒计时                                             | `-`  |
| `reset` | 重设倒计时，若`auto-reset`为`true`，重设会自动开始倒计时 | `-`  |
