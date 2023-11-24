# Ellipsis 文本省略

## 介绍

展示空间不足时，隐去部分内容并用“…”替代。

### 头部省略

```demo
import StartExample from '../example/StartExample.vue'
```

### 尾部省略

```demo
import EndExample from '../example/EndExample.vue'
```

### 居中省略

```demo
import MiddleExample from '../example/MiddleExample.vue'
```

### 多行展示

```demo
import RowsExample from '../example/RowsExample.vue'
```

### 自定义省略符号

```demo
import SymbolExample from '../example/SymbolExample.vue'
```


## API

### 属性

| 参数            | 说明           | 类型                       | 默认值  |
| --------------- | -------------- | -------------------------- | ------- |
| `content`       | 文本内容       | _string_                   | -       |
| `direction`     | 省略位置       | _'start'\|'end'\|'middle'_ | `'end'` |
| `rows`          | 展示行数       | _number_                   | `1`     |
| `expand-text`   | 展开操作的文案 | _string_                   | `''`    |
| `collapse-text` | 收起操作的文案 | _string_                   | `''`    |
| `symbol`        | 省略的文案     | _string_                   | `'...'` |
| `line-height`   | 容器的行高     | _string\|number_           | `20`    |

### 事件

| 事件名   | 说明               | 参数      |
| -------- | ------------------ | --------- |
| `change` | 点击展开收起时触发 | `boolean` |
