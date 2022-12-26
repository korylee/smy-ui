# Cell 单元格

## API

### 属性

| 参数          | 说明             | 类型                 | 默认值  |
| ------------- | ---------------- | -------------------- | ------- |
| `title`       | 单元格标题       | _string_ \| _number_ | `-`     |
| `desc`        | 单元格描述       | _string_             | `-`     |
| `border`      | 是否展示边框     | _boolean_            | `false` |
| `clickable`   | 是否展示点击动画 | _boolean_            | `false` |
| `insert`      | 卡片样式         | _boolean_            | `false` |
| `title-class` | 标题额外类名     | _string_             | `-`     |
| `desc-class`  | 描述额外类名     | _string_             | `-`     |
| `extra-class` | 右侧内容额外类名 | _string_             | `-`     |

### 插槽

| 名称      | 说明                  | 参数 |
| --------- | --------------------- | ---- |
| `default` | cell 的标题内容       | `-`  |
| `icon`    | 自定义左侧`icon` 区域 | `-`  |
| `desc`    | 描述的内容            | `-`  |
| `extra`   | 自定义右侧内容        | `-`  |
