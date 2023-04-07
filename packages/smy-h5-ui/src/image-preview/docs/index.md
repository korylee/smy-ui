# 图片预览

### 介绍

图片放大预览，支持组件调用

### 引入

```js
import Vue from 'vue'
import { ImagePreview } from '@smy-h5/ui'

Vue.use(ImagePreview)
```

### 局部引入

```js
import { ImagePreview } from '@smy-h5/ui'

export default {
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
}
```

## 函数调用

### 基本使用

```js
ImagePreview('https://korylee.github.io/blog/avatar.png')
```

### 处理回调函数

```js
const images = ['https://korylee.github.io/blog/avatar.png']
ImagePreview({
  images,
  onChange(index) {
    console.log(index)
  },
})
```

## 组件使用

### 基本使用

```html
<template>
  <div>
    <smy-image-preview :show.sync="showPreview" :images="imgData" />
    <smy-cell title="展示图片预览" @click="handleShowPreview" />
  </div>
</template>
<script>
  export default {
    data: () => ({
      showPreview: false,
      imgData: ['https://korylee.github.io/blog/avatar.png', 'https://korylee.github.io/blog/avatar.png'],
    }),
    methods: {
      handleShowPreview() {
        this.showPreview = true
      },
    },
  }
</script>
```

## API

### 属性

| 参数            | 说明                    | 类型                    | 默认值  |
| --------------- | ----------------------- | ----------------------- | ------- |
| `show.sync`     | 是否显示                | _boolean_               | `false` |
| `images`        | 需要预览的图片 URL 数组 | _string[]_              | `[]`    |
| `zoom`          | 双击放大倍数            | _string\|number_        | `2`     |
| `closeable`     | 是否显示关闭按钮        | _boolean_               | `false` |
| `loop`          | 是否循环播放            | _boolean_               | `true`  |
| `autoplay`      | 自动播放间隔时间 (ms)   | _string\|number_        | `-`     |
| `indicator`     | 是否显示分页            | _boolean_               | `true`  |
| `initial-index` | 初始化显示的索引        | _number\|string_        | `0`     |
| `lock-scroll`   | 锁定滚动                | _boolean_               | `true`  |
| `teleport`      | 弹出层挂载的位置        | _TeleportProps\['to'\]_ | `-`     |

### 事件

| 事件名   | 说明                                     | 回调参数                 |
| -------- | ---------------------------------------- | ------------------------ |
| `change` | 切换图片时的回调函数，回调参数为当前索引 | `index: number` 图片索引 |
| `open`   | 打开 image-preview 时触发                | `-`                      |
| `opened` | 打开 image-preview 动画结束时触发        | `-`                      |
| `close`  | 关闭 image-preview 时触发                | `-`                      |
| `closed` | 关闭 image-preview 动画结束时触发        | `-`                      |

### 插槽

| 插槽名       | 说明         | 参数                                                 |
| ------------ | ------------ | ---------------------------------------------------- |
| `indicator`  | 分页指示器   | `index: number`图片索引<br>`length: number` 图片总数 |
| `close-icon` | 关闭按钮     | `-`                                                  |
| `extra`      | 额外插槽     | `-`                                                  |
| `image`      | 图片展示插槽 | `image: string` props.images 配置的图片项            |

### ImagePreview Options

| 参数           | 说明                                      | 类型                      | 默认值  |
| -------------- | ----------------------------------------- | ------------------------- | ------- |
| `images`       | 需要预览的图片 URL 数组或者单个图片的 URL | _string[]\|string_        | `[]`    |
| `zoom`         | 双击放大倍数                              | _string\|number_          | `2`     |
| `closeable`    | 是否显示关闭按钮                          | _boolean_                 | `false` |
| `loop`         | 是否循环播放                              | _boolean_                 | `true`  |
| `autoplay`     | 自动播放间隔时间 (ms)                     | _string\|number_          | `-`     |
| `indicator`    | 是否显示分页                              | _boolean_                 | `true`  |
| `initialIndex` | 初始化显示的索引                          | _number\|string_          | `0`     |
| `lockScroll`   | 锁定滚动                                  | _boolean_                 | `true`  |
| `teleport`     | 弹出层挂载的位置                          | _TeleportProps['to']_     | `-`     |
| `onChange`     | 切换图片时的回调函数，回调参数为当前索引  | _(index: number) => void_ | `-`     |
| `onOpen`       | image-preview 开启时候的回调              | _() => void_              | `-`     |
| `onOpened`     | image-preview 动画结束时候的回调          | _() => void_              | `-`     |
| `onClose`      | image-preview 时关闭时候的回调            | _() => void_              | `-`     |
| `onClosed`     | image-preview 关闭动画结束时候的回调      | _() => void_              | `-`     |
