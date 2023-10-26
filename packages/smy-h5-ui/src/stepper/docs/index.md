# Stepper 步进器

### 介绍

### 引入

```js
import Vue from 'vue'
import { Stepper } from '@smy-h5/ui'

Vue.use(Stepper)
```

### 基础用法

```demo
import BasicExample from '../example/BasicExample.vue'
```

### 步长设置

设置步长为`2`

```demo
import StepExample from '../example/StepExample.vue'
```

### 限制输入范围

`min` 和 `max` 属性分别表示最小值和最大值

```demo
import LimitExample from '../example/LimitExample.vue'
```

### 禁用操作

`disabled` 禁用状态下无法点击按钮或修改输入框。

```demo
import DisabledExample from '../example/DisabledExample.vue'
```

### 只读禁用输入框

`readonly` 设置只读禁用输入框输入行为

```demo
import ReadonlyExample from '../example/ReadonlyExample.vue'
```

### 支持小数

设置步长 `step` 0.1 `decimal-places` 小数保留 1 位

```demo
import DecimalExample from '../example/DecimalExample.vue'
```

### 自定义按钮大小

```demo
import CustomSizeExample from '../example/CustomSizeExample.vue'
```

### 自定义按钮

```demo
import ButtonExample from '../example/ButtonExample.vue'
```

## API

### 属性

| 参数             | 说明                         | 类型             | 默认值     |
| ---------------- | ---------------------------- | ---------------- | ---------- |
| `v-model`        | 绑定的值                     | _number\|string_ | `-`        |
| `min`            | 最小值                       | _number\|string_ | `0`        |
| `max`            | 最大值                       | _number\|string_ | `Infinity` |
| `step`           | 步长                         | _number\|string_ | `1`        |
| `decimal-places` | 保留小数位数                 | _number\|string_ | `0`        |
| `readonly`       | 是否只读                     | _boolean_        | `false`    |
| `disabled`       | 是否禁用                     | _boolean_        | `false`    |
| `disabled-plus`  | 是否禁用增加                 | _boolean_        | `false`    |
| `disabled-minus` | 是否禁用减少                 | _boolean_        | `false`    |
| `width`          | 步进器的宽度                 | _string\|number_ | `-`        |
| `height`         | 步进器的高度                 | _string\|number_ | `-`        |
| `button-width`   | 【增加】【减少】按钮的宽度   | _string\|number_ | `-`        |
| `button-size`    | 【增加】【减少】按钮字体大小 | _string\|number_ | `-`        |

### 事件

| 事件名   | 说明     | 回调参数 |
| -------- | -------- | -------- |
| `input`  | 值的改变 | `number` |
| `change` | 值的改变 | `Event`  |
| `plus`   | 点击增加 | `Event`  |
| `minus`  | 点击减少 | `Event`  |
| `focus`  | 聚焦事件 | `Event`  |
| `blur`   | 失焦事件 | `Event`  |
