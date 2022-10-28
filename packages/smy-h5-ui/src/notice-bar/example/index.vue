<template>
  <div>
    <div>
      <h4>基础使用</h4>
      <NoticeBar
        text="华为畅享9新品即将上市，活动期间0元预约可参与抽奖，赢HUAWEI WATCH等好礼，更多产品信息请持续关注！"
      />
    </div>
  </div>
</template>

<script>
import NoticeBar from '../NoticeBar.vue'

export default {
  name: 'NoticeBarExample',
  components: { NoticeBar },
  methods: {
    handleClick(e) {
      console.log(e)
    },
  },
}
</script>

<style></style>
