# Picker 多列选择器

## TODO

3d 滚轮转盘样式效果

### 引入

```js
// playground-ignore
import Vue from 'vue'
import { Picker } from '@smy-h5/ui'

Vue.use(Picker)
```

## 函数调用

### 单列选择

```html
<script>
  import { Picker, Toast } from '@smy-h5/ui'
  const column = [
    { text: '南京市', value: 'NanJing' },
    { text: '无锡市', value: 'WuXi' },
    { text: '海北藏族自治区', value: 'ZangZu' },
    { text: '北京市', value: 'BeiJing' },
    { text: '连云港市', value: 'LianYunGang' },
    { text: '浙江市', value: 'ZheJiang' },
    { text: '江苏市', value: 'JiangSu' },
  ]

  Picker([column]).then(({ state, values, indexes }) => {
    Toast(`${state}: ${values}`)
    console.log(state, values, indexes)
  })
</script>
```

### 多列选择

```js
const multipleColumns = [
  [
    { text: '周一', value: 'Monday' },
    { text: '周二', value: 'Tuesday' },
    { text: '周三', value: 'Wednesday' },
    { text: '周四', value: 'Thursday' },
    { text: '周五', value: 'Friday' },
  ],
  [
    { text: '上午', value: 'Morning' },
    { text: '下午', value: 'Afternoon' },
    { text: '晚上', value: 'Evening' },
  ],
]

Picker(multipleColumns).then(({ state, values, indexes }) => {
  Toast(`${state}: ${values}`)
  console.log(state, values, indexes)
})
```

### 默认选中项

```js
const multipleColumns = [
  [
    { text: '周一', value: 'Monday' },
    { text: '周二', value: 'Tuesday' },
    { text: '周三', value: 'Wednesday' },
    { text: '周四', value: 'Thursday' },
    { text: '周五', value: 'Friday' },
  ],
  [
    { text: '上午', value: 'Morning' },
    { text: '下午', value: 'Afternoon' },
    { text: '晚上', value: 'Evening' },
  ],
]

Picker({ columns: multipleColumns, value: ['Tuesday', 'Afternoon'] }).then(({ state, values, indexes }) => {
  Toast(`${state}: ${values}`)
  console.log(state, values, indexes)
})
```

### 级联选择

```js
const cascadeColumns = [
  {
    text: '北京市',
    children: [
      {
        text: '市辖区1',
        children: [
          {
            text: '东城区',
          },
          {
            text: '西城区',
          },
        ],
      },
    ],
  },
  {
    text: '天津市',
    children: [
      {
        text: '市辖区2',
        children: [
          {
            text: '和平区',
          },
          {
            text: '河东区',
          },
        ],
      },
    ],
  },
]
Picker({ cascade: true, columns: cascadeColumns, textFormatter: 'text', valueFormatter: 'text' }).then(
  ({ state, values, indexes }) => {
    Toast(`${state}: ${values}`)
    console.log(state, values, indexes)
  }
)
```

## 组件调用

### 单列选择

```html
<template>
  <div>
    <smy-cell insert :title="value ? value.join(',') : '请选择'" @click="show = true" />
    <smy-picker
      v-model="value"
      :show.sync="show"
      :columns="[column]"
      title="请选择"
      @confirm="show = false"
      @cancel="show = false"
    />
  </div>
</template>
<script>
  const column = [
    { text: '南京市', value: 'NanJing' },
    { text: '无锡市', value: 'WuXi' },
    { text: '海北藏族自治区', value: 'ZangZu' },
    { text: '北京市', value: 'BeiJing' },
    { text: '连云港市', value: 'LianYunGang' },
    { text: '浙江市', value: 'ZheJiang' },
    { text: '江苏市', value: 'JiangSu' },
  ]

  export default {
    data: () => ({
      show: false,
      column,
      value: undefined,
    }),
  }
</script>
```

### 多列使用

`columns` 属性可以通过二维数组的形式配置多列选择。

```html
<template>
  <div>
    <smy-cell insert :title="value ? value.join(',') : '请选择'" @click="show = true" />
    <smy-picker v-model="value" :show.sync="show" :columns="multipleColumns" title="请选择" @cancel="show = false" />
  </div>
</template>
<script>
  const multipleColumns = [
    [
      { text: '周一', value: 'Monday' },
      { text: '周二', value: 'Tuesday' },
      { text: '周三', value: 'Wednesday' },
      { text: '周四', value: 'Thursday' },
      { text: '周五', value: 'Friday' },
    ],
    [
      { text: '上午', value: 'Morning' },
      { text: '下午', value: 'Afternoon' },
      { text: '晚上', value: 'Evening' },
    ],
  ]

  export default {
    data: () => ({
      show: false,
      multipleColumns,
      value: undefined,
    }),
  }
</script>
```

### 级联使用

```html
<template>
  <div>
    <smy-cell insert :title="value ? value.join(',') : '请选择'" @click="show = true" />
    <smy-picker
      v-model="value"
      :show.sync="show"
      :columns="cascadeColumns"
      cascade
      title="请选择"
      text-formatter="text"
      value-formatter="text"
      @cancel="show = false"
      @confirm="show = false"
    />
  </div>
</template>
<script>
  const cascadeColumns = [
    {
      text: '北京市',
      children: [
        {
          text: '市辖区1',
          children: [{ text: '东城区' }, { text: '西城区' }],
        },
      ],
    },
    {
      text: '天津市',
      children: [
        {
          text: '市辖区2',
          children: [{ text: '和平区' }, { text: '河东区' }],
        },
      ],
    },
  ]

  export default {
    data: () => ({
      show: false,
      column: Array.from({ length: 10 }, (_, index) => index),
      value: undefined,
      cascadeColumns,
    }),
  }
</script>
```

### 默认选中项

通过设置 `value` 实现默认选中项，`value` 是一个包含每项配置 `value` 值的数组

```html
<template>
  <div>
    <smy-cell insert :title="value ? value.join(',') : '请选择'" @click="show = true" />
    <smy-picker
      v-model="value"
      :show.sync="show"
      :columns="multipleColumns"
      title="请选择"
      @cancel="show = false"
      @confirm="show = false"
    />
  </div>
</template>
<script>
  const multipleColumns = [
    [
      { text: '周一', value: 'Monday' },
      { text: '周二', value: 'Tuesday' },
      { text: '周三', value: 'Wednesday' },
      { text: '周四', value: 'Thursday' },
      { text: '周五', value: 'Friday' },
    ],
    [
      { text: '上午', value: 'Morning' },
      { text: '下午', value: 'Afternoon' },
      { text: '晚上', value: 'Evening' },
    ],
  ]

  export default {
    data: () => ({
      show: false,
      multipleColumns,
      value: ['Tuesday', 'Afternoon'],
    }),
  }
</script>
```

## API

### 属性

| 参数                  | 说明                       | 类型                                               | 默认值     |
| --------------------- | -------------------------- | -------------------------------------------------- | ---------- |
| `columns`             | 列内容                     | _any[][]_                                          | `[]`       |
| `title`               | 标题                       | _string_                                           | `提示`     |
| `cancel-button-text`  | 取消按钮文字               | _string_                                           | `取消`     |
| `confirm-button-text` | 确认按钮文字               | _string_                                           | `确认`     |
| `toolbar`             | 是否展示上方工具栏         | _string_                                           | `true`     |
| `cascade`             | 是否级联                   | _boolean_                                          | `false`    |
| `option-height`       | 选项的高度（px\rem\vh\vm） | _string \| number_                                 | `44`       |
| `option-count`        | 可见的选项个数             | _string\|number_                                   | `6`        |
| `text-formatter`      | 文本格式化                 | _string\| ((column:any, columnIndex:number)=>any)_ | `text`     |
| `value-formatter`     | 值格式化                   | _string\| ((column:any, columnIndex:number)=>any)_ | `value`    |
| `children-formatter`  | 子级格式化                 | _string\| ((column:any, columnIndex:number)=>any)_ | `children` |

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
