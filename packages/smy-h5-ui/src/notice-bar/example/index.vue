<template>
  <div>
    <app-demo-title>基础使用</app-demo-title>
    <smy-notice-bar :text="text" />
    <app-demo-title>禁用滚动</app-demo-title>
    <smy-notice-bar :text="text" :scrollable="false" />
    <app-demo-title>可关闭</app-demo-title>
    <smy-notice-bar :text="text" closable />
    <app-demo-title>链接模式</app-demo-title>
    <smy-notice-bar :text="text" closable>
      <a href="https://www.github.com">github</a>
    </smy-notice-bar>
    <app-demo-title>多行展示</app-demo-title>
    <smy-notice-bar :text="text" closable wrapable />
    <app-demo-title>竖向</app-demo-title>
    <smy-notice-bar closable :scrollable="false">
      <template #left-icon>12</template>
      <smy-swiper vertical class="notice-swipe" :autoplay="3000" height="40">
        <smy-swiper-item>内容 1</smy-swiper-item>
        <smy-swiper-item>内容 2</smy-swiper-item>
        <smy-swiper-item>内容 3</smy-swiper-item>
      </smy-swiper>
    </smy-notice-bar>
  </div>
</template>

<script>
import SmyNoticeBar from '../'
import SmySwiper from '../../swiper'
import SmySwiperItem from '../../swiper-item'
import { AppDemoTitle } from '@smy-h5/cli/client'

export default {
  name: 'NoticeBarExample',
  components: { SmyNoticeBar, SmySwiper, SmySwiperItem, AppDemoTitle },
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
