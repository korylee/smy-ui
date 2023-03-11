<template>
  <div class="badge-example">
    <div>
      <div>基础用法</div>
      <div>
        <smy-badge content="8"> <span class="title">标题</span> </smy-badge>
        <smy-badge content="76"> <span class="title">标题</span> </smy-badge>
        <smy-badge content="NEW"> <span class="title">标题</span> </smy-badge>
        <smy-badge content="NEW" bubble> <span class="title">标题</span> </smy-badge>
        <smy-badge content="NEW" dot> <span class="title">标题</span> </smy-badge>
      </div>
    </div>
    <div>最大值</div>
    <div>
      <smy-badge content="200" max="9"> <span class="title">标题</span> </smy-badge>
      <smy-badge content="200" max="20"> <span class="title">标题</span> </smy-badge>
      <smy-badge content="200" max="99"> <span class="title">标题</span> </smy-badge>
    </div>
    <div>自定义颜色</div>
    <smy-badge content="8" color="linear-gradient(135deg, #fa2c19 0%, #fa6419 100%)">
      <span class="title">标题</span>
    </smy-badge>
    <smy-badge content="76" color="linear-gradient(135deg, #fa2c19 0%, #fa6419 100%)">
      <span class="title">标题</span>
    </smy-badge>
    <smy-badge content="NEW" color="linear-gradient(135deg, #fa2c19 0%, #fa6419 100%)">
      <span class="title">标题</span>
    </smy-badge>
    <smy-badge content="NEW" bubble color="linear-gradient(135deg, #fa2c19 0%, #fa6419 100%)">
      <span class="title">标题</span>
    </smy-badge>
    <smy-badge content="NEW" dot color="linear-gradient(135deg, #fa2c19 0%, #fa6419 100%)">
      <span class="title">标题</span>
    </smy-badge>
    <div>
      <div>自定义位置</div>
      <smy-badge content="200" top="5" right="10"> <span class="title">标题</span> </smy-badge>
      <smy-badge content="200" right="-10"> <span class="title">标题</span> </smy-badge>
      <smy-badge content="200"> <span class="title">标题</span> </smy-badge>
    </div>
  </div>
</template>
<script>
import SmyBadge from '../'

export default {
  name: 'BadgeExample',
  components: { SmyBadge },
}
</script>

<style lang="less" scope>
.badge-example {
  .title {
    display: inline-block;
    font-size: 20px;
    line-height: 24px;
  }
  .smy-badge {
    margin-left: 16px;
  }
}
</style>
