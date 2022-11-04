<template>
  <div>
    <div>
      <h4>基础使用</h4>
      <NoticeBar :text="text" />
      <h4>禁用滚动</h4>
      <NoticeBar :text="text" :scrollable="false" />
      <h4>可关闭</h4>
      <NoticeBar :text="text" closable />
      <h4>链接模式</h4>
      <NoticeBar :text="text" closable>
        <a href="https://www.github.com">github</a>
      </NoticeBar>
    </div>
  </div>
</template>

<script>
import NoticeBar from '../'

export default {
  name: 'NoticeBarExample',
  components: { NoticeBar },
  data: () => ({
    text: '华为畅享9新品即将上市，活动期间0元预约可参与抽奖，赢HUAWEI WATCH等好礼，更多产品信息请持续关注！',
  }),
  methods: {
    handleClick(e) {
      console.log(e)
    },
  },
}
</script>

<style></style>
