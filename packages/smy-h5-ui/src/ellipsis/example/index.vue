<template>
  <div class="ellipsis-example">
    <app-demo-title>头部省略</app-demo-title>
    <smy-ellipsis :content="content" direction="start" />
    <app-demo-title>尾部省略</app-demo-title>
    <smy-ellipsis :content="content" direction="end" />
    <app-demo-title>居中省略</app-demo-title>
    <smy-ellipsis :content="content" direction="middle" />
    <app-demo-title>多行展示</app-demo-title>
    <smy-ellipsis :content="content" rows="2" />
    <app-demo-title>展开收起</app-demo-title>
    <smy-ellipsis :content="content" direction="start" expandText="展开" collapse-text="收起" />
    <smy-ellipsis :content="content" direction="middle" expandText="展开" collapse-text="收起" />
    <smy-ellipsis :content="content" expandText="展开" collapse-text="收起" />
  </div>
</template>

<script>
import { Ellipsis as SmyEllipsis } from '@ui-entry'
import { AppDemoTitle } from '@smy-h5/cli/client'

export default {
  name: 'EllipsisExample',
  components: {
    SmyEllipsis,
    AppDemoTitle,
  },
  data: () => ({
    content:
      '缓缓飘落的枫叶像思念，为何挽回要赶在冬天来之前，爱你穿越时间，两行来自秋末的眼泪，让爱渗透了地面我要的只是你在我身边',
  }),
}
</script>

<style lang="less" scoped>
.app-type {
  margin-top: 30px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #909ca4;
  padding: 0 10px;
  font-weight: 400;
}
</style>
