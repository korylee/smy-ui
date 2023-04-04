<template>
  <div class="badge-example">
    <div>
      <div class="app-demo-title">基础用法</div>
      <div>
        <smy-badge value="8"> <span class="title">标题</span> </smy-badge>
        <smy-badge value="76"> <span class="title">标题</span> </smy-badge>
        <smy-badge value="NEW"> <span class="title">标题</span> </smy-badge>
        <smy-badge value="NEW" bubble> <span class="title">标题</span> </smy-badge>
        <smy-badge value="NEW" dot> <span class="title">标题</span> </smy-badge>
      </div>
    </div>
    <div class="app-demo-title">最大值</div>
    <div>
      <smy-badge value="200" max="9"> <span class="title">标题</span> </smy-badge>
      <smy-badge value="200" max="20"> <span class="title">标题</span> </smy-badge>
      <smy-badge value="200" max="99"> <span class="title">标题</span> </smy-badge>
    </div>
    <div class="app-demo-title">不同定位</div>
    <div>
      <smy-badge value="200"> <span class="title">右上</span> </smy-badge>
      <smy-badge value="200" position="right-bottom"> <span class="title">右下</span> </smy-badge>
      <smy-badge value="200" position="left-top"> <span class="title">左上</span> </smy-badge>
      <smy-badge value="200" position="left-bottom"> <span class="title">左下</span> </smy-badge>
    </div>
    <div class="app-demo-title">是否显示</div>
    <button @click="hidden = !hidden">点击改变状态</button>
    <smy-badge :hidden="hidden" value="8">
      <span class="title">标题</span>
    </smy-badge>

    <div class="app-demo-title">自定义颜色</div>
    <smy-badge value="8" :color="color">
      <span class="title">标题</span>
    </smy-badge>
    <smy-badge value="76" :color="color">
      <span class="title">标题</span>
    </smy-badge>
    <smy-badge value="NEW" :color="color">
      <span class="title">标题</span>
    </smy-badge>
    <smy-badge value="NEW" bubble :color="color">
      <span class="title">标题</span>
    </smy-badge>
    <smy-badge value="NEW" dot :color="color">
      <span class="title">标题</span>
    </smy-badge>
    <div>
      <div class="app-demo-title">自定义位置</div>
      <smy-badge value="200" top="5" right="10"> <span class="title">标题</span> </smy-badge>
      <smy-badge value="200" right="-10"> <span class="title">标题</span> </smy-badge>
      <smy-badge value="200"> <span class="title">标题</span> </smy-badge>
    </div>
  </div>
</template>
<script>
import SmyBadge from '../'

export default {
  name: 'BadgeExample',
  components: { SmyBadge },
  data: () => ({
    color: 'linear-gradient(135deg, #fa2c19 0%, #fa6419 100%)',
    hidden: false,
  }),
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
