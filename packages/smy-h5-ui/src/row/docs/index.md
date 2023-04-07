# 布局

### 介绍

组件库提供了`<smy-col />` 和 `<smy-row />`两个辅助布局的组件

### 引入

```js
import Vue from 'vue'
import { Row, Col } from '@smy-h5/ui'

Vue.use(Row).use(Col)
```

### 栅格系统

`<smy-row/>` 组件把一行平均划分为 24 列 栅格( 24 份 )，`<smy-col/>` 提供 span 属性设置这一列所占的份数，offset 属性设置这一列偏移的份数。

```html
<template>
  <div class="demo-item">
    <smy-row>
      <smy-col class="flex-item">span:24</smy-col>
    </smy-row>
    <smy-row>
      <smy-col class="flex-item" span="12">span:12</smy-col>
      <smy-col class="flex-item" span="12">span:12</smy-col>
    </smy-row>
    <smy-row>
      <smy-col class="flex-item" span="8">span:8</smy-col>
      <smy-col class="flex-item flex-item--light" span="8">span:8</smy-col>
      <smy-col class="flex-item" span="8">span:8</smy-col>
    </smy-row>
    <smy-row>
      <smy-col class="flex-item" span="6">span:6</smy-col>
      <smy-col class="flex-item flex-item--light" span="6">span:6</smy-col>
      <smy-col class="flex-item" span="6">span:6</smy-col>
      <smy-col class="flex-item" span="6">span:6</smy-col>
    </smy-row>
  </div>
</template>
<style lang="less" scoped>
  .smy-row {
    overflow: hidden;
    &:not(:last-child) .smy-col {
      margin-bottom: 15px;
    }
  }

  .flex-item {
    line-height: 40px;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    background: #ff8881;
    font-size: 12px;
    &--light {
      background: #ffc7c4;
    }
  }
</style>
```

### 偏移

```html
<smy-row wrap="wrap">
  <smy-col offset="8" span="16">
    <div class="flex-item">span:8</div>
  </smy-col>
  <smy-col span="8">
    <div class="flex-item flex-item--light">span:8</div>
  </smy-col>
  <smy-col span="8">
    <div class="flex-item">span:8</div>
  </smy-col>
</smy-row>
```

### 对齐

```html
<smy-row>
  <smy-col span="8"> <div class="flex-item">span:8</div> </smy-col>
  <smy-col span="8"> <div class="flex-item">span:8</div> </smy-col>
</smy-row>
<smy-row justify="center">
  <smy-col span="8"> <div class="flex-item">span:8</div> </smy-col>
  <smy-col span="8"> <div class="flex-item">span:8</div> </smy-col>
</smy-row>
```

### 分栏间隔

```html
<smy-row :gutter="10">
  <smy-col span="8">
    <div class="flex-item">span:8</div>
  </smy-col>
  <smy-col span="8">
    <div class="flex-item flex-item--light">span:8</div>
  </smy-col>
  <smy-col span="8">
    <div class="flex-item">span:8</div>
  </smy-col>
</smy-row>
```

## API

### 属性

#### Row Props

| 参数      | 说明                                                                                   | 类型             | 默认值       |
| --------- | -------------------------------------------------------------------------------------- | ---------------- | ------------ |
| `gutter`  | 列间距                                                                                 | _string\|number_ | `0`          |
| `justify` | 主轴对齐方式, 可选值为 `flex-start` `flex-end` `center` `space-between` `space-around` | _string_         | `flex-start` |
| `align`   | 交叉轴对齐方式, 可选值为 `flex-start` `flex-end` `center`                              | _string_         | `flex-start` |

#### Col Props

| 参数     | 说明           | 类型             | 默认值 |
| -------- | -------------- | ---------------- | ------ |
| `span`   | 列占据的栅格数 | _string\|number_ | `0`    |
| `offset` | 列偏移的栅格数 | _string\|number_ | `0`    |

### 事件

#### Row Events

| 事件名 | 说明            | 回调参数       |
| ------ | --------------- | -------------- |
| click  | 点击 Row 时触发 | `event: Event` |

#### Col Events

| 事件名 | 说明            | 回调参数       |
| ------ | --------------- | -------------- |
| click  | 点击 Col 时触发 | `event: Event` |

### 插槽

#### Row Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | ---- |
| default | Row 内容 | `-`  |

#### Col Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | ---- |
| default | Col 内容 | `-`  |
