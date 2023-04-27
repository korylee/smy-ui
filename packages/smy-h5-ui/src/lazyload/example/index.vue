<template>
  <div class="smy-lazyload-example">
    <app-demo-title>基础使用</app-demo-title>
    <img
      v-for="item of 8"
      :key="item"
      v-lazy="{
        src: 'https://korylee.github.io/blog/avatar.png',
        loading: 'https://p3-passport.byteimg.com/img/user-avatar/723589e93ad8bfa3701aea6efef08bb8~100x100.awebp',
        attempt: 'https://p3-passport.byteimg.com/img/user-avatar/723589e93ad8bfa3701aea6efef08bb8~100x100.awebp',
      }"
      class="cat"
    />
  </div>
</template>

<script>
import Lazy from '..'
import { AppDemoTitle } from '@smy-h5/cli/client'

export default {
  name: 'LazyExample',
  directives: { Lazy },
  components: { AppDemoTitle },
}
</script>

<style lang="less" scoped>
.smy-lazyload-example {
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    background-size: cover;
    pointer-events: none;
  }
}
</style>
