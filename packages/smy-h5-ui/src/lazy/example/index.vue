<template>
  <div class="smy-lazy-example">
    <div>基础使用</div>
    <img class="cat" v-lazy="'https://varlet-vue2.vercel.app/cat.jpg'" />
    <img class="cat" v-lazy="'https://varlet-vue2.vercel.app/cat.jpg'" />
    <img class="cat" v-lazy="'https://varlet-vue2.vercel.app/cat.jpg'" />
    <img class="cat" v-lazy="'https://varlet-vue2.vercel.app/cat.jpg'" />
    <img class="cat" v-lazy="'https://varlet-vue2.vercel.app/cat.jpg'" />
  </div>
</template>

<script>
import Lazy from '..'
export default {
  name: 'LazyExample',
  directives: { Lazy },
}
</script>

<style lang="less" scoped>
.smy-lazy-example {
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    background-size: cover;
    pointer-events: none;
  }
}
</style>
