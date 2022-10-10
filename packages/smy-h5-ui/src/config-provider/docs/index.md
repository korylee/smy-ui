# 全局化配置

### 介绍

组件库通过 [css 变量](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)来组织样式，每个组件都有对应的样式变量

后续会扩展支持除 css 样式变量外的配置，如 confirm 组件的默认文案等

### 基本样式变量

以下是组件库一些基本的样式变量

```css
:root {
  --font-size-xs: 10px;
  --font-size-sm: 12px;
  --font-size-md: 14px;
  --font-size-lg: 16px;
  --icon-size-xs: 16px;
  --icon-size-sm: 18px;
  --icon-size-md: 20px;
  --icon-size-lg: 22px;
  --color-body: #fff;
  --color-text: #333;
  --color-primary: #3a7afe;
  --color-info: #00afef;
  --color-success: #00c48f;
  --color-warning: #ff9f00;
  --color-danger: #f44336;
  --color-disabled: #e0e0e0;
  --color-text-disabled: #aaa;
  --cubic-bezier: cubic-bezier(0.25, 0.8, 0.5, 1);
}
```

### 引入

```js
import Vue from 'vue'
import { ConfigProvider } from '@smy-h5/ui'

Vue.use(ConfigProvider)
```