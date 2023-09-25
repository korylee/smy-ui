# Tag 标签

### 介绍

用于标记关键词和概括主要内容

### 引入

```js
// playground-ignore
import Vue from 'vue'
import { Tag } from '@smy-h5/ui'

Vue.use(Tag)
```

### 基础用法

```html
<smy-tag type="primary">12151</smy-tag>
<smy-tag type="success">12151</smy-tag>
<smy-tag type="warning">12151</smy-tag>
<smy-tag type="danger">12151</smy-tag>
```

### 空心样式

```html
<smy-tag type="primary" plain>12151</smy-tag>
<smy-tag type="success" plain>12151</smy-tag>
<smy-tag type="warning" plain>12151</smy-tag>
<smy-tag type="danger" plain>12151</smy-tag>
```

### 原角

```html
<smy-tag type="primary" round>12151</smy-tag>
<smy-tag type="success" round>12151</smy-tag>
<smy-tag type="warning" round>12151</smy-tag>
<smy-tag type="danger" round>12151</smy-tag>
```

## Api

### 属性

| 参数   | 说明                                                           | 类型     | 默认值 |
| ------ | -------------------------------------------------------------- | -------- | ------ |
| `type` | 类型, 可选值为 `''`, `primary`, `success`, `danger`, `warning` | _string_ | `''`   |
