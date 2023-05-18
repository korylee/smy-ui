# ProgressCircular 圆进度条

### 介绍

### 引入

```js
import Vue from 'vue'
import { ProgressCircular } from '@smy-h5/ui'

Vue.use(ProgressCircular)
```

### 基础使用

```html
<template>
  <smy-cell>
    <smy-progress-circular :value="value" size="50" />
    <template #extra>
      <div class="smy--flex">value:<smy-stepper v-model="value" max="100" /></div>
    </template>
  </smy-cell>
</template>
<script>
  export default {
    data: () => ({
      value: 20,
    }),
  }
</script>
```

### 自定义颜色

```html
<smy-progress-circular size="30" value="20" color="#f38181" bg-color="#fce38a" />
```

### indeterminate 状态

```html
<template>
  <smy-cell>
    <smy-progress-circular :indeterminate="indeterminate" value="20" size="30" />
    <template #extra>
      <div>indeterminate <smy-swtich v-model="indeterminate" /></div>
    </template>
  </smy-cell>
</template>
<script>
  export default {
    data: () => ({
      indeterminate: true,
    }),
  }
</script>
```

### 自定义大小和宽度

```html
<smy-cell>
  <smy-progress-circular indeterminate size="40" width="9" />
  <smy-progress-circular indeterminate size="50" width="7" />
  <smy-progress-circular indeterminate size="60" width="5" />
  <smy-progress-circular indeterminate size="70" width="3" />
  <smy-progress-circular indeterminate size="80" width="1" />
</smy-cell>
```

### 旋转原点

```html
<template>
  <smy-cell>
    <smy-progress-circular :value="rotateValue" rotate="360" color="#009688" size="60" width="6">
      {{ rotateValue }}
    </smy-progress-circular>
    <smy-progress-circular :value="rotateValue" rotate="-90" color="#f0932b" size="60" width="6">
      {{ rotateValue }}
    </smy-progress-circular>
    <smy-progress-circular :value="rotateValue" rotate="90" color="#f44336" size="60" width="6">
      {{ rotateValue }}
    </smy-progress-circular>
    <smy-progress-circular :value="rotateValue" rotate="180" color="#1e90ff" size="60" width="6">
      {{ rotateValue }}
    </smy-progress-circular>
  </smy-cell>
</template>
<script>
  export default {
    data: () => ({ interval: undefined, rotateValue: 0 }),
    mounted() {
      this.interval = setInterval(() => {
        if (this.rotateValue === 100) {
          this.rotateValue = 0
          return
        }
        this.rotateValue += 10
      }, 1000)
    },
    beforeDestroy() {
      clearInterval(this.interval)
    },
  }
</script>
```
