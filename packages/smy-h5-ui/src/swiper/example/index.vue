<template>
  <div>
    <app-demo-title>基本用法</app-demo-title>
    <smy-swiper :initial-index="2" indicator autoplay="2000">
      <smy-swiper-item v-for="item of list" :key="item">
        <img :src="item" alt="" />
      </smy-swiper-item>
    </smy-swiper>
    <app-demo-title>异步动态加载(3s)</app-demo-title>
    <smy-swiper :initial-index="2" indicator autoplay="2000">
      <smy-swiper-item v-for="item of asyncList" :key="item">
        <img :src="item" alt="" />
      </smy-swiper-item>
    </smy-swiper>
    <app-demo-title>垂直</app-demo-title>
    <smy-swiper :initial-index="2" indicator autoplay="2000" vertical height="150" style="height: 150px">
      <smy-swiper-item v-for="item of list" :key="item">
        <img :src="item" alt="" />
      </smy-swiper-item>
    </smy-swiper>
    <app-demo-title>自定义大小</app-demo-title>
    <smy-swiper :initial-index="2" indicator autoplay="2000" width="300">
      <smy-swiper-item v-for="item of list" :key="item">
        <img :src="item" alt="" />
      </smy-swiper-item>
    </smy-swiper>
    <app-demo-title>手动切换</app-demo-title>
    <smy-swiper ref="swiper" :initial-index="2" indicator>
      <smy-swiper-item v-for="item of list" :key="item">
        <img :src="item" alt="" />
      </smy-swiper-item>
      <template #extra>
        <div class="smy-swiper-btns">
          <span class="smy-swiper-btns__left" @click="$refs.swiper.prev()">prev</span>
          <span class="smy-swiper-btns__right" @click="$refs.swiper.next()">next</span>
        </div>
      </template>
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
    asyncList: [],
  }),
  mounted() {
    setTimeout(() => {
      this.asyncList = [...this.list]
    }, 3000)
    setTimeout(() => {
      this.asyncList.splice(1, 1)
    }, 5000)
  },
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

.smy-swiper-btns {
  width: 100%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  display: flex;
  justify-content: space-between;

  span {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    line-height: 30px;
    background-color: rgba(0, 0, 0, 0.4);
    color: #fff;
  }
}
</style>
