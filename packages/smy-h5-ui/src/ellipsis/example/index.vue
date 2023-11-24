<template>
  <div class="ellipsis-example">
    <app-demo-title>头部省略</app-demo-title>
    <start-example />
    <app-demo-title>尾部省略</app-demo-title>
    <end-example />
    <app-demo-title>居中省略</app-demo-title>
    <middle-example />
    <app-demo-title>多行展示</app-demo-title>
    <rows-example />
    <app-demo-title>自定义省略符号</app-demo-title>
    <symbol-example />
    <app-demo-title>展开收起</app-demo-title>
    <expand-example />
  </div>
</template>

<script>
import { AppDemoTitle } from '@smy-h5/cli/client'
import StartExample from './StartExample.vue'
import EndExample from './EndExample.vue'
import MiddleExample from './MiddleExample.vue'
import RowsExample from './RowsExample.vue'
import SymbolExample from './SymbolExample.vue'
import ExpandExample from './ExpandExample.vue'

export default {
  name: 'EllipsisExample',
  components: {
    AppDemoTitle,
    StartExample,
    EndExample,
    MiddleExample,
    RowsExample,
    SymbolExample,
    ExpandExample,
  },
}
</script>
