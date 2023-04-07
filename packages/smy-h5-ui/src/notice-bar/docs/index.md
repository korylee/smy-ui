# NoticeBar 通告栏

### 介绍

用于循环播放一组消息通知

### 引入

```js
import { NoticeBar } from '@smy-h5/ui'
import Vue from 'vue'

Vue.use(NoticeBar)
```

### 基础用法

```html
<smy-notice-bar
  text="华为畅享9新品即将上市，活动期间0元预约可参与抽奖，赢HUAWEI WATCH等好礼，更多产品信息请持续关注！"
/>
```

### 可关闭

```html
<smy-notice-bar
  text="华为畅享9新品即将上市，活动期间0元预约可参与抽奖，赢HUAWEI WATCH等好礼，更多产品信息请持续关注！"
  closable
/>
```

### 链接模式

```html
<smy-notice-bar closable>
  <a href="https://www.github.com">github</a>
</smy-notice-bar>
```

### 多行展示

```html
<smy-notice-bar
  text="华为畅享9新品即将上市，活动期间0元预约可参与抽奖，赢HUAWEI WATCH等好礼，更多产品信息请持续关注！"
  wrapable
/>
```

### 纵向滚动

```html
<smy-notice-bar closable :scrollable="false">
  <smy-swiper vertical class="notice-swipe" :autoplay="3000" height="40">
    <smy-swiper-item>内容 1</smy-swiper-item>
    <smy-swiper-item>内容 2</smy-swiper-item>
    <smy-swiper-item>内容 3</smy-swiper-item>
  </smy-swiper>
</smy-notice-bar>
```

## API

### 属性

| 参数         | 说明                                          | 类型             | 默认值  |
| ------------ | --------------------------------------------- | ---------------- | ------- |
| `text`       | 提示的信息                                    | _string_         | `-`     |
| `scrollable` | 是否可以滚动                                  | _boolean_        | `true`  |
| `closeable`  | 是否启用关闭模式(右侧关闭图标)                | _boolean_        | `false` |
| `wrapable`   | 是否开启文本换行，`scrollable` 会设置为 false | _boolean_        | `false` |
| `delay`      | 延迟(单位：s)                                 | _string\|number_ | `1000`  |
| `speed`      | 滚动速率 (单位：px/s)                         | _number_         | `50`    |

### 事件

| 事件名  | 说明             | 参数           |
| ------- | ---------------- | -------------- |
| `click` | 外层点击事件回调 | `event: Event` |
| `close` | 关闭通知栏时触发 | `event: Event` |

### 插槽

| 插槽名       | 说明           | 参数 |
| ------------ | -------------- | ---- |
| `default`    | 通知文本的内容 | `-`  |
| `right-icon` | 自定义右侧图标 | `-`  |
| `left-icon`  | 自定义左侧图标 | `-`  |
