# 全局化配置

### 介绍

组件库通过 [css 变量](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)来组织样式，每个组件都有对应的样式变量

后续会扩展支持除 css 样式变量外的配置，如 confirm 组件的默认文案等

样式通过 css3 变量覆盖实现
其余通过 inject、provide 依赖注入实现

### 引入

```js
import Vue from 'vue'
import { ConfigProvider } from '@smy-h5/ui'

Vue.use(ConfigProvider)
```
