# Stepper 步进器

## API

### 属性

| 参数             | 说明                 | 类型             | 默认值     |
| ---------------- | -------------------- | ---------------- | ---------- |
| `v-model`        | 绑定的值             | _number\|string_ | `-`        |
| `min`            | 最小值               | _number\|string_ | `0`        |
| `max`            | 最大值               | _number\|string_ | `Infinity` |
| `step`           | 步长                 | _number\|string_ | `1`        |
| `decimal-places` | 保留小数位数         | _number\|string_ | `0`        |
| `readonly`       | 是否只读             | _boolean_        | `false`    |
| `disabled`       | 是否禁用             | _boolean_        | `false`    |
| `simple`         | 简单样式（不带边框） | _boolean_        | `true`     |

### 事件

| 事件名           | 说明     | 回调参数 |
| ---------------- | -------- | -------- |
| `change`         | 值的改变 | `number` |
| `plus`           | 点击增加 | `-`      |
| `plus-no-allow`  | 无法增加 | `-`      |
| `minus`          | 点击减少 | `-`      |
| `minus-no-allow` | 无法减少 | `-`      |
| `focus`          | 聚焦事件 | `-`      |
| `blur`           | 失焦事件 | `-`      |
