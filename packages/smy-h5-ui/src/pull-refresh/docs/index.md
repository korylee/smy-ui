# PullRefresh 下拉刷新

### 介绍

用于提供下拉刷新的交互操作

### 引入

```js
import Vue from 'vue'
import { PullRefresh } from '@smy-h5/ui'

Vue.use(PullRefresh)
```

### 基础用法

下拉时触发 refresh 事件，在回调事件中可进行异步操作刷新数据，擦偶哦完成后将 v-model 设置为 false，即刷新完成。

```html
<template>
  <div>
    <smy-pull-refresh v-model="refresh" @refresh="onRefresh">
      <div class="pull-block">下拉刷新</div>
    </smy-pull-refresh>
  </div>
</template>
<script>
  import { PullRefresh, Toast } from '@smy-h5/ui'

  export default {
    components: { SmyPullRefresh: PullRefresh },
    data: () => ({
      refresh: false,
    }),
    methods: {
      onRefresh() {
        setTimeout(() => {
          this.refresh = false
          Toast('刷新成功！')
        }, 2000)
      },
    },
  }
</script>
<style lang="less" scoped>
  .pull-block {
    text-align: center;
    color: #999;
    font-size: 16px;
    padding-top: 60px;
  }

  .smy-pull-refresh {
    height: calc(100vh - 110px);
  }
</style>
```

## API

### 属性

| 参数            | 说明                        | 类型             | 默认值      |
| --------------- | --------------------------- | ---------------- | ----------- |
| `v-model`       | 是否触发下拉刷新            | _boolean_        | `false`     |
| `pull-disance`  | 触发下拉刷新的距离          | _number\|string_ | `50`        |
| `header-height` | 顶部内容高度                | _number\|string_ | `50`        |
| `loading-text`  | 加载过程提示文案            | _string_         | `加载中...` |
| `pulling-text`  | 下拉过程提示文案            | _string_         | `下拉刷新`  |
| `loosing-text`  | 下拉过程提示文案            | _string_         | `释放刷新`  |
| `duration`      | 下拉动画加载时长（单位：s） | _number_         | `0.3`       |

### 事件

| 事件名  | 说明                     | 回调参数                                                                      |
| ------- | ------------------------ | ----------------------------------------------------------------------------- |
| change  | 下拉过程或状态改变时触发 | `{status: 'normal' \| 'loading' \| 'loosing' \| 'pulling', distance: number}` |
| refresh | 下拉刷新事件回调         | `-`                                                                           |

### 插槽

| 名称    | 说明               | 参数                                                                                           |
| ------- | ------------------ | ---------------------------------------------------------------------------------------------- |
| header  | 顶部内容           | `status: 'normal' \| 'loading' \| 'loosing' \| 'pulling'` 当前状态<br> `distance: number` 距离 |
| default | 自定义内容         | `-`                                                                                            |
| pulling | 下拉过程的顶部内容 | `-`                                                                                            |
| loosing | 释放过程中顶部内容 | `-`                                                                                            |
| loading | 加载过程中顶部内容 | `-`                                                                                            |
