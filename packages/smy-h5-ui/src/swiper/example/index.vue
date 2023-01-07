<template>
  <div>
    <div>基础</div>
    <smy-swiper :initial-index="2" indicator autoplay="2000">
      <smy-swiper-item v-for="item of list" :key="item">
        <img :src="item" alt="" />
      </smy-swiper-item>
    </smy-swiper>
    <div>垂直</div>
    <smy-swiper :initial-index="2" indicator autoplay="2000" vertical height="150" style="height: 150px">
      <smy-swiper-item v-for="item of list" :key="item">
        <img :src="item" alt="" />
      </smy-swiper-item>
    </smy-swiper>
  </div>
</template>

<script>
import SmySwiper from '../'
import SmySwiperItem from '../../swiper-item'

export default {
  name: 'SwiperExample',
  components: { SmySwiper, SmySwiperItem },
  data: () => ({
    page: 2,
    list: [
      'https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg',
      'https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg',
      'https://storage.360buyimg.com/jdc-article/welcomenutui.jpg',
      'https://storage.360buyimg.com/jdc-article/fristfabu.jpg',
    ],
  }),
}
</script>

<style lang="less" scoped>
.smy-swiper-item {
  height: 150px;
  img {
    width: 100%;
    height: 100%;
    -webkit-user-drag: none;
  }
}
</style>
