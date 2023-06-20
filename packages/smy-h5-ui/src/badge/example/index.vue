<template>
  <div class="badge-example">
    <app-demo-title>基础用法</app-demo-title>
    <smy-badge value="8"> <span class="title">标题</span> </smy-badge>
    <smy-badge value="76"> <span class="title">标题</span> </smy-badge>
    <smy-badge value="NEW"> <span class="title">标题</span> </smy-badge>
    <smy-badge value="NEW" bubble> <span class="title">标题</span> </smy-badge>
    <smy-badge value="NEW" dot> <span class="title">标题</span> </smy-badge>

    <app-demo-title>最大值</app-demo-title>

    <smy-badge value="200" max="9"> <span class="title">标题</span> </smy-badge>
    <smy-badge value="200" max="20"> <span class="title">标题</span> </smy-badge>
    <smy-badge value="200" max="99"> <span class="title">标题</span> </smy-badge>

    <app-demo-title>不同定位</app-demo-title>
    <smy-badge value="200"> <span class="title">右上</span> </smy-badge>
    <smy-badge value="200" position="right-bottom"> <span class="title">右下</span> </smy-badge>
    <smy-badge value="200" position="left-top"> <span class="title">左上</span> </smy-badge>
    <smy-badge value="200" position="left-bottom"> <span class="title">左下</span> </smy-badge>

    <app-demo-title>是否显示(点击“标题”改变状态)</app-demo-title>
    <smy-badge :hidden="hidden" value="8">
      <span class="title" @click="hidden = !hidden">标题</span>
    </smy-badge>

    <app-demo-title>自定义颜色</app-demo-title>
    <smy-badge value="8" color="linear-gradient(135deg, #fa2c19 0%, #fa6419 100%)">
      <span class="title">标题</span>
    </smy-badge>
    <smy-badge value="76" color="linear-gradient(135deg, #fa2c19 0%, #fa6419 100%)">
      <span class="title">标题</span>
    </smy-badge>
    <smy-badge value="NEW" color="linear-gradient(135deg, #fa2c19 0%, #fa6419 100%)">
      <span class="title">标题</span>
    </smy-badge>
    <smy-badge value="NEW" bubble color="linear-gradient(135deg, #fa2c19 0%, #fa6419 100%)">
      <span class="title">标题</span>
    </smy-badge>
    <smy-badge value="NEW" dot color="linear-gradient(135deg, #fa2c19 0%, #fa6419 100%)">
      <span class="title">标题</span>
    </smy-badge>

    <app-demo-title>自定义位置</app-demo-title>
    <smy-badge value="200"> <span class="title">标题</span> </smy-badge>
    <smy-badge value="200" top="40" right="20"> <span class="title">标题</span> </smy-badge>
    <smy-badge value="200" right="40" top="20"> <span class="title">标题</span> </smy-badge>

    <app-demo-title>自定义徽标内容</app-demo-title>
    <smy-badge>
      <span class="title">标题</span>
      <template #icon>
        <smy-icon><xml /></smy-icon>
      </template>
    </smy-badge>
    <app-demo-title>独立存在</app-demo-title>
    <smy-badge value="8" />
    <smy-badge value="76" />
    <smy-badge value="NEW" />
    <smy-badge value="NEW" bubble />
  </div>
</template>
<script>
import SmyBadge from '../'
import SmyIcon from '../../icon'
import SmySwitch from '../../switch'
import { Xml } from '@smy-h5/icons'
import { AppDemoTitle } from '@smy-h5/cli/client'

export default {
  name: 'BadgeExample',
  components: { SmyBadge, SmyIcon, Xml, AppDemoTitle, SmySwitch },
  data: () => ({
    hidden: false,
  }),
}
</script>

<style lang="less" scope>
.badge-example {
  .title {
    display: inline-block;
    font-size: 14px;
    line-height: 40px;
    width: 40px;
    height: 40px;
    background: rgb(238, 238, 238);
    color: rgb(102, 102, 102);
    text-align: center;
    border-radius: 3px;
  }
  .smy-badge {
    &:not(:first-child) {
      margin-left: 30px;
    }
    &:first-child {
      margin-left: 10px;
    }
  }
}
</style>
