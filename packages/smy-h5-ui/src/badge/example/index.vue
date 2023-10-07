<template>
  <div class="badge-example">
    <app-demo-title>基础用法</app-demo-title>
    <basic-example />

    <app-demo-title>最大值</app-demo-title>
    <max-example />

    <app-demo-title>不同定位</app-demo-title>
    <position-example />

    <app-demo-title>是否显示(点击“标题”改变状态)</app-demo-title>
    <hidden-example />

    <app-demo-title>自定义颜色</app-demo-title>
    <color-example />

    <app-demo-title>自定义位置</app-demo-title>
    <custom-position-example />

    <app-demo-title>自定义徽标内容</app-demo-title>
    <content-example />

    <app-demo-title>独立存在</app-demo-title>
    <alone-example />
  </div>
</template>
<script>
import { AppDemoTitle } from '@smy-h5/cli/client'
import BasicExample from './BasicExample.vue'
import MaxExample from './MaxExample.vue'
import PositionExample from './PositionExample.vue'
import HiddenExample from './HiddenExample.vue'
import ColorExample from './ColorExample.vue'
import CustomPositionExample from './CustomPositionExample.vue'
import ContentExample from './ContentExample.vue'
import AloneExample from './AloneExample.vue'

export default {
  name: 'BadgeExample',
  components: {
    AppDemoTitle,
    BasicExample,
    MaxExample,
    PositionExample,
    HiddenExample,
    ColorExample,
    CustomPositionExample,
    ContentExample,
    AloneExample,
  },
}
</script>
