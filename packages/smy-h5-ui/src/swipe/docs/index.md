# Swipe 滑动手势

### 介绍

常用于单元格左右滑删除等手势操作

### 引入

```js
import Vue from 'vue'
import { Swipe } from '@smy-h5/ui'

Vue.use(Swipe)
```

### 基础用法

```demo
import BasicExample from '../example/BasicExample.vue'
```

### 禁用滑动

```demo
import DisabledExample from '../example/DisabledExample.vue'
```

### 左右滑动

```demo
import SwipeExample from '../example/SwipeExample.vue'
```

## API

### 属性

| 参数     | 说明     | 类型      | 默认值  |
| -------- | -------- | --------- | ------- |
| disabled | 是否禁用 | _boolean_ | `false` |

### 事件

| 事件名  | 说明       | 回调参数                                                 |
| ------- | ---------- | -------------------------------------------------------- |
| `open`  | 打开时触发 | `(data: {position: 'left'\|'right'}) => void`            |
| `close` | 关闭时触发 | `(data: {position: 'left'\|'right'\|'outside'}) => void` |

### 插槽

| 插槽名    | 说明         | 参数 |
| --------- | ------------ | ---- |
| `left`    | 左侧滑动内容 | `-`  |
| `default` | 默认插槽     | `-`  |
| `right`   | 右侧滑动内容 | `-`  |
