# Swiper 轮播

## 介绍

常用于一组图片或卡片轮播

### 引入

```js
// playground-ignore
import Vue from 'vue'
import { Swiper, SwiperItem } from '@smy-h5/ui'

Vue.use(Swiper).use(SwiperItem)
```

## API

### 属性

| 参数                 | 说明                       | 类型             | 默认值   |
| -------------------- | -------------------------- | ---------------- | -------- |
| `width`              | 轮播卡片的宽度             | _number\|string_ | `'auto'` |
| `height`             | 轮播卡片的高度             | _number\|string_ | `'auto'` |
| `vertical`           | 轮播方向是否垂直           | _boolean_        | `false`  |
| `loop`               | 是否开启循环轮播           | _boolean_        | `true`   |
| `autoplay`           | 自动播放间隔时间 (ms)      | _string\|number_ | `-`      |
| `indicator`          | 是否展示分页指示器         | _boolean_        | `true`   |
| `initial-index`      | 初始化显示的索引           | _string\|number_ | `0`      |
| `touchable`          | 是否可以拖动               | _boolean_        | `true`   |
| `is-prevent-default` | 滑动过程中是否禁用默认事件 | _boolean_        | `true`   |
| `is-stop-progration` | 滑动过程中是否禁用冒泡     | _boolean_        | `true`   |

### 方法

| 方法名 | 说明           | 参数            | 返回值 |
| ------ | -------------- | --------------- | ------ |
| `prev` | 上一页         | `-`             | `-`    |
| `next` | 下一页         | `-`             | `-`    |
| `to`   | 跳转到指定下标 | `index: number` | `-`    |

### 事件

| 事件名   | 说明           | 参数                     |
| -------- | -------------- | ------------------------ |
| `change` | 滑动之后的回调 | `index: number` 轮播索引 |

### 插槽

| 名称        | 说明         | 参数                                                   |
| ----------- | ------------ | ------------------------------------------------------ |
| `default`   | 轮播内容     | `-`                                                    |
| `indicator` | 自定义分页器 | `index: number` 轮播索引<br> `length: number` 轮播总数 |
