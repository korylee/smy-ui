# Switch 开关

### 介绍

用来打开或关闭选项。

### 引入

```js
import Vue from 'vue'
import { Switch } from '@smy-h5/ui'

Vue.use(Switch)
```

### 基础用法

```html
<template>
  <smy-switch v-model="active" />
</template>
<script>
  export default {
    data: () => ({
      active: false,
    }),
  }
</script>
```

### 自定义值

```html
<template>
  <smy-switch v-model="active" active-value="hello" inactive-value="goodbye" />
</template>
<script>
  export default {
    data: () => ({
      active: '',
    }),
  }
</script>
```

### 禁用状态

```html
<template>
  <smy-switch v-model="active" disabled />
</template>
<script>
  export default {
    data: () => ({
      active: false,
    }),
  }
</script>
```

### 加载中

```html
<template>
  <smy-switch v-model="active" loading />
</template>
<script>
  export default {
    data: () => ({
      active: false,
    }),
  }
</script>
```

### 任意尺寸

```html
<template>
  <div>
    <smy-switch v-model="active" size="12" />
    <smy-switch v-model="active" size="16" />
    <smy-switch v-model="active" size="20" />
    <smy-switch v-model="active" size="26" />
    <smy-switch v-model="active" size="32" />
  </div>
</template>
<script>
  export default {
    data: () => ({
      active: false,
    }),
  }
</script>
```

### 自定义颜色

```html
<template>
  <smy-switch v-model="active" inactive-color="pink" active-color="blue" />
</template>
<script>
  export default {
    data: () => ({
      active: false,
    }),
  }
</script>
```

### 支持文字

```html
<template>
  <smy-switch v-model="active" inactive-label="关" active-label="开" />
</template>
<script>
  export default {
    data: () => ({
      active: false,
    }),
  }
</script>
```

## API

### 属性

| 参数             | 说明           | 类型                      | 默认值  |
| ---------------- | -------------- | ------------------------- | ------- |
| `v-model`        | 开关状态       | _boolean\|string\|number_ | `false` |
| `disabled`       | 禁用状态       | _boolean_                 | `false` |
| `loading`        | 加载中状态     | _boolean_                 | `false` |
| `loading-color`  | 加载中图标颜色 | _string_                  | `-`     |
| `loading-size`   | 加载中图标大小 | _string_                  | `-`     |
| `size`           | 开关大小       | _string\|number_          | `12`    |
| `active-color`   | 激活颜色       | _string_                  | `-`     |
| `inactive-color` | 未激活颜色     | _string_                  | `-`     |
| `active-label`   | 激活的标签文本 | _string_                  | `-`     |
| `inactive-label` | 未激活标签文本 | _string_                  | `-`     |
| `active-value`   | 激活的值       | _string\|number\|boolean_ | `true`  |
| `inactive-value` | 未激活的值     | _string\|number\|boolean_ | `false` |

### 事件

| 事件名   | 说明     | 回调参数 |
| -------- | -------- | -------- |
| `change` | 值的改变 | `any`    |

### 插槽

| 名称      | 说明       | 参数 |
| --------- | ---------- | ---- |
| `loading` | 加载中图标 | `-`  |
