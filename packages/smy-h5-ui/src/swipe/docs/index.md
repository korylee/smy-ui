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

```html
<template>
  <smy-swipe>
    <smy-cell title="基本用法" insert></smy-cell>
    <template #right>
      <div class="delete-btn btn">删除</div>
    </template>
  </smy-swipe>
</template>
<style lang="less" scoped>
  .btn {
    position: relative;
    display: inline-block;
    width: auto;
    flex-shrink: 0;
    height: 38px;
    box-sizing: border-box;
    margin: 0px;
    line-height: 36px;
    padding: 0px 18px;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
    transition: opacity 0.2s ease 0s;
    appearance: none;
    user-select: none;
    touch-action: manipulation;
    vertical-align: bottom;
    -webkit-tap-highlight-color: transparent;
  }
  .delete-btn {
    height: 100%;
    color: rgb(255, 255, 255);
    background: rgb(250, 44, 25);
    border: 1px solid transparent;
  }
</style>
```

### 禁用滑动

```html
<smy-swipe disabled>
  <smy-cell title="禁用滑动" insert></smy-cell>
  <template #right>
    <div class="delete-btn btn">删除</div>
  </template>
</smy-swipe>
```

### 左右滑动

```html
<smy-swipe>
  <smy-cell title="左滑右滑" insert></smy-cell>
  <template #left>
    <div class="choose-btn btn">选择</div>
  </template>
  <template #right>
    <div class="delete-btn btn">删除</div>
  </template>
</smy-swipe>
```

## API

### 属性

| 参数     | 说明     | 类型      | 默认值  |
| -------- | -------- | --------- | ------- |
| disabled | 是否禁用 | _boolean_ | `false` |

### 事件

| 事件名 | 说明       | 回调参数                                      |
| ------ | ---------- | --------------------------------------------- |
| `open`   | 打开时触发 | `(data: {position: 'left'\|'right'}) => void` |
| `close`  | 关闭时触发 | `(data: {position: 'left'\|'right'}) => void` |

### 插槽

| 插槽名    | 说明         | 参数 |
| --------- | ------------ | ---- |
| `left`    | 左侧滑动内容 | `-`  |
| `default` | 默认插槽     | `-`  |
| `right`   | 右侧滑动内容 | `-`  |
