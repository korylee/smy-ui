# Steps 步骤条

### 属性

#### Steps Props

| 参数           | 说明           | 类型               | 默认值  |
| -------------- | -------------- | ------------------ | ------- |
| `current`      | 当前步骤       | _string \| number_ | `0`     |
| `vertical`     | 是否竖向       | _boolean_          | `false` |
| `progress-dot` | 是否为点状样式 | _boolean_          | `false` |
| `reverse`      | 是否翻转       | _boolean_          | `false` |

#### Step Props

| 参数      | 说明 | 类型     | 默认值 |
| --------- | ---- | -------- | ------ |
| `title`   | 标题 | _string_ | `''`   |
| `content` | 描述 | _string_ | `''`   |

### 事件

#### Steps Events

| 事件名       | 说明                       | 回调参数        |
| ------------ | -------------------------- | --------------- |
| `click-step` | 点击步骤的标题或图标时触发 | `index: number` |

### 插槽

#### Step Slots

| 名称      | 说明        | 参数 |
| --------- | ----------- | ---- |
| `default` | step 的内容 | `-`  |
| `title`   | step 的标题 | `-`  |
| `icon`    | step 的图标 | `-`  |
