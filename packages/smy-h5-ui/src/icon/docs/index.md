# 图标组件

提供基于字体 和 svg 的图标库，也支持网络图片。图标字体来自[xions](https://www.xicons.org/)Material 风格。

### 引入

```js
import Vue from 'vue'
import { Icon } from '@smy-h5/ui'

Vue.use(Icon)
```

### 组件引入使用

```html
<template>
  <smy-icon><check-circle-outline /></smy-icon>
</template>
<script>
  // webpack >=4 支持treeshaking
  import { CheckCircleOutline } from '@smy-h5/icons/dist/es'
  // 若不支持可以如下使用。
  import CheckCircleOutline from '@smy-h5/icons/dist/es/CheckCircleOutline'

  export default {
    components: {
      CheckCircleOutline,
    },
  }
</script>
```

### iconfont 使用

```html
<template>
  <smy-icon name="check-circle-outline" />
</template>
<style>
  @import '@smy-h5/icons/css';
</style>
```

### 图标尺寸

```html
<!-- iconfont -->
<smy-icon name="check-circle-outline" />
<smy-icon name="check-circle-outline" size="24" />
<!-- 组件 -->
<smy-icon><check-circle-outline /></smy-icon>
<smy-icon size="24"><check-circle-outline /></smy-icon>
```

### 图标颜色

```html
<!-- iconfont -->
<smy-icon name="check-circle-outline" />
<smy-icon name="check-circle-outline" color="#2979ff" />
<!-- 组件 -->
<smy-icon><check-circle-outline /></smy-icon>
<smy-icon color="#2979ff"><check-circle-outline /></smy-icon>
```

### 使用图片

```html
<smy-icon size="30">
  <img src="https://korylee.github.io/blog/avatar.png" />
</smy-icon>
```

### 图标切换动画

```html
<template>
  <smy-icon color="#2979ff" size="30" :transition="300" :name="iconName" @click="toggle" />
</template>
<script>
  export default {
    data: () => ({
      iconName: 'plus',
    }),
    methods: {
      toggle() {
        this.iconName = this.iconName === 'plus' ? 'minus' : 'plus'
      },
    },
  }
</script>
```

## API

### 属性

| 参数    | 说明     | 类型               | 默认值 |
| ------- | -------- | ------------------ | ------ |
| `size`  | 尺寸     | _string \| number_ | `-`    |
| `color` | 图标颜色 | _string_           | `-`    |

### 事件

| 事件名  | 说明           | 参数           |
| ------- | -------------- | -------------- |
| `click` | 点击图标时触发 | `event: Event` |
