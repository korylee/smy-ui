# 徽标

### 引入

```js
import Vue from 'vue'
import { Badge } from '@smy-h5/ui'

Vue.use(Badge)
```

### 基础用法

```demo
import BasicExample from '../example/BasicExample.vue'
```

### 最大值

通过 `value` 和 `max` 控制徽标显示值的范围（当 `value` 与 `max` 都存在时生效）。

```demo
import MaxExample from '../example/MaxExample.vue'
```

### 不同定位

通过 `position` 属性设置徽标的位置。

```demo
import PositionExample from '../example/PositionExample.vue'
```

### 是否展示

```demo
import HiddenExample from '../example/HiddenExample.vue'
```

### 自定义颜色

```demo
import ColorExample from '../example/ColorExample.vue'
```

### 自定义位置

```demo
import CustomPositionExample from '../example/CustomPositionExample.vue'
```

### 自定义徽标内容

```demo
import ContentExample from '../example/ContentExample.vue'
```

### 独立使用

```demo
import AloneExample from '../example/AloneExample.vue'
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
