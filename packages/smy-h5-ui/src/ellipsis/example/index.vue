<template>
  <div class="ellipsis-example">
    <div>头部省略</div>
    <smy-ellipsis :content="content" direction="start" />
    <div>尾部省略</div>
    <smy-ellipsis :content="content" direction="end" />
    <div>居中省略</div>
    <smy-ellipsis :content="content" direction="middle" />
    <div>多行展示</div>
    <smy-ellipsis :content="content" rows="2" />
    <div>展开收起</div>
    <smy-ellipsis :content="content" direction="start" expandText="展开" collapse-text="收起" />
    <smy-ellipsis :content="content" direction="middle" expandText="展开" collapse-text="收起" />
    <smy-ellipsis :content="content" expandText="展开" collapse-text="收起" />
  </div>
</template>

<script>
import SmyEllipsis from '../'

export default {
  name: 'EllipsisExample',
  components: {
    SmyEllipsis,
  },
  data: () => ({
    content:
      '缓缓飘落的枫叶像思念，为何挽回要赶在冬天来之前，爱你穿越时间，两行来自秋末的眼泪，让爱渗透了地面我要的只是你在我身边',
  }),
}
</script>

<style></style>
