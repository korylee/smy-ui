<template>
  <div>
    <app-demo-title>基础用法</app-demo-title>
    <basic-example />
    <app-demo-title>自定义类型</app-demo-title>
    <type-example />
    <app-demo-title>禁用输入框</app-demo-title>
    <disabled-example />
    <app-demo-title>显示图标</app-demo-title>
    <clear-example />
    <app-demo-title>插入按钮</app-demo-title>
    <button-example />
    <app-demo-title>显示字数统计</app-demo-title>
    <word-limit-example />
    <app-demo-title>高度自适应</app-demo-title>
    <autosize-example />
  </div>
</template>

<script>
import { AppDemoTitle } from '@smy-h5/cli/client'
import BasicExample from './BasicExample.vue'
import TypeExample from './TypeExample.vue'
import DisabledExample from './DisabledExample.vue'
import ClearExample from './ClearExample.vue'
import ButtonExample from './ButtonExample.vue'
import WordLimitExample from './WordLimitExample.vue'
import AutosizeExample from './AutosizeExample.vue'

export default {
  name: 'InputExample',
  components: {
    AppDemoTitle,
    BasicExample,
    TypeExample,
    DisabledExample,
    ClearExample,
    ButtonExample,
    WordLimitExample,
    AutosizeExample,
  },
}
</script>
