<template>
  <div>
    <div>
      <h4>基础使用</h4>
      <smy-notice-bar :text="text" />
      <h4>禁用滚动</h4>
      <smy-notice-bar :text="text" :scrollable="false" />
      <h4>可关闭</h4>
      <smy-notice-bar :text="text" closable />
      <h4>链接模式</h4>
      <smy-notice-bar :text="text" closable>
        <a href="https://www.github.com">github</a>
      </smy-notice-bar>
      <h4>竖向</h4>
      <smy-notice-bar closable :scrollable="false">
        <smy-swiper direction="vertical" class="notice-swipe" :autoplay="3000" height="40">
          <smy-swiper-item>内容 1</smy-swiper-item>
          <smy-swiper-item>内容 2</smy-swiper-item>
          <smy-swiper-item>内容 3</smy-swiper-item>
        </smy-swiper>
      </smy-notice-bar>
    </div>
  </div>
</template>

<script>
import SmyNoticeBar from '../'
import SmySwiper from '../../swiper'
import SmySwiperItem from '../../swiper-item'

export default {
  name: 'NoticeBarExample',
  components: { SmyNoticeBar, SmySwiper, SmySwiperItem },
  data: () => ({
    list: ['aaaaaaaaaaa', 'bbbbbbbbbbb'],
    text: '华为畅享9新品即将上市，活动期间0元预约可参与抽奖，赢HUAWEI WATCH等好礼，更多产品信息请持续关注！',
  }),
  methods: {
    handleClick(e) {
      console.log(e)
    },
  },
}
</script>

<style lang="less" scoped>
.notice-swipe {
  height: 40px;
  line-height: 40px;
}
</style>
