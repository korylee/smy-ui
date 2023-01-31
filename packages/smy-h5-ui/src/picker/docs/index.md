# Picker 多列选择器

## TODO

3d 滚轮转盘样式效果

## API

### 属性

| 参数                  | 说明                 | 类型                                  | 默认值         |
| --------------------- | -------------------- | ------------------------------------- | -------------- |
| `columns`             | 列内容               | _NormalColumn[]\|Texts_               | `[]`           |
| `title`               | 标题                 | _string_                              | `提示`         |
| `text-key`            | 文本的属性 key       | _string_                              | `text`         |
| `toolbar`             | 是否展示上方工具栏   | _string_                              | `true`         |
| `text-formatter`      | 文本格式化           | _(text:any, columnIndex:number)=>any_ | `text => text` |
| `option-height`       | 选项的高度（px\rem） | _string \| number_                    | `44`           |
| `option-count`        | 可见的选项个数       | _string\|number_                      | `6`            |
| `confirm-button-text` | 确认按钮文字         | _string_                              | `确认`         |
| `cancel-button-text`  | 取消按钮文字         | _string_                              | `取消`         |

### 事件

| 事件名    | 说明                 | 参数                                                              |
| --------- | -------------------- | ----------------------------------------------------------------- |
| `change`  | 选择内容时触发       | `texts:Texts`选择的内容数组<br/>`indexes: number[]`选择的下标数组 |
| `cancel`  | 点击取消时触发       | `texts:Texts`选择的内容数组<br/>`indexes: number[]`选择的下标数组 |
| `confirm` | 点击确认按钮时时触发 | `texts:Texts`选择的内容数组<br/>`indexes: number[]`选择的下标数组 |

### 插槽

| 插槽名    | 说明         | 参数 |
| --------- | ------------ | ---- |
| `cancel`  | 取消按钮内容 | `-`  |
| `title`   | 标题内容     | `-`  |
| `confirm` | 确认按钮内容 | `-`  |
