# 徽标

### 引入

```js
import Vue from 'vue'
import { Badge } from '@smy-h5/ui'

Vue.use(Badge)
```

### 基础用法

```html
<smy-badge value="8"> <span class="title">标题</span> </smy-badge>
<smy-badge value="76"> <span class="title">标题</span> </smy-badge>
<smy-badge value="NEW"> <span class="title">标题</span> </smy-badge>
<smy-badge value="NEW" bubble> <span class="title">标题</span> </smy-badge>
<smy-badge value="NEW" dot> <span class="title">标题</span> </smy-badge>
```

### 最大值

通过 `value` 和 `max` 控制徽标显示值的范围（当 `value` 与 `max` 都存在时生效）。

```html
<smy-badge value="200" max="9"> <span class="title">标题</span> </smy-badge>
<smy-badge value="200" max="20"> <span class="title">标题</span> </smy-badge>
<smy-badge value="200" max="99"> <span class="title">标题</span> </smy-badge>
```

### 不同定位

通过 `position` 属性设置徽标的位置。

```html
<smy-badge value="200"> <span class="title">右上</span> </smy-badge>
<smy-badge value="200" position="right-bottom"> <span class="title">右下</span> </smy-badge>
<smy-badge value="200" position="left-top"> <span class="title">左上</span> </smy-badge>
<smy-badge value="200" position="left-bottom"> <span class="title">左下</span> </smy-badge>
```

### 是否展示

```html
<button @click="hidden = !hidden">点击改变状态</button>
<smy-badge :hidden="hidden" value="8">
  <span class="title">标题</span>
</smy-badge>
```

### 自定义颜色

```html
<smy-badge value="8" color="linear-gradient(135deg, #fa2c19 0%, #fa6419 100%)">
  <span class="title">标题</span>
</smy-badge>
<smy-badge value="76" color="linear-gradient(135deg, #fa2c19 0%, #fa6419 100%)">
  <span class="title">标题</span>
</smy-badge>
<smy-badge value="NEW" color="linear-gradient(135deg, #fa2c19 0%, #fa6419 100%)">
  <span class="title">标题</span>
</smy-badge>
<smy-badge value="NEW" bubble color="linear-gradient(135deg, #fa2c19 0%, #fa6419 100%)">
  <span class="title">标题</span>
</smy-badge>
<smy-badge value="NEW" dot color="linear-gradient(135deg, #fa2c19 0%, #fa6419 100%)">
  <span class="title">标题</span>
</smy-badge>
```

### 自定义位置

```html
<smy-badge value="200" top="5" right="10"> <span class="title">标题</span> </smy-badge>
<smy-badge value="200" right="-10"> <span class="title">标题</span> </smy-badge>
<smy-badge value="200"> <span class="title">标题</span> </smy-badge>
```

### 自定义徽标内容

```html
<smy-badge>
  <span class="title">标题</span>
  <template #icon>
    <smy-icon><xml /></smy-icon>
  </template>
</smy-badge>
```

## API

### 属性

| 参数      | 说明                                 | 类型             | 默认值  |
| --------- | ------------------------------------ | ---------------- | ------- |
| `value`   | 显示的内容                           | _string\|number_ | `-`     |
| `max`     | `value`为数值时，最大值              | _number_         | `10000` |
| `dot`     | 是否为圆点展示                       | _boolean_        | `false` |
| `bubble`  | 是否为气泡形状                       | _boolean_        | `false` |
| `hidden`  | 是否隐藏                             | _boolean_        | `false` |
| `top`     | 上下偏移量，支持数值，`px`,`rem`,`%` | _number\|string_ | `0`     |
| `right`   | 左右偏移量，支持数值，`px`,`rem`,`%` | _number\|string_ | `0`     |
| `z-index` | 徽标的 `z-index` 值                  | _number_         | `10`    |
| `color`   | 徽标背景颜色                         | _string_         | `-`     |

### 插槽

| 插槽名称  | 说明               | 参数 |
| --------- | ------------------ | ---- |
| `default` | 徽标内包裹的子元素 | `-`  |
| `icon`    | 徽标自定义         | `-`  |
