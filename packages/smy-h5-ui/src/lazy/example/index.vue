<template>
  <div class="smy-lazy-example">
    <app-demo-title>基础使用</app-demo-title>
    <img class="cat" v-lazy="'https://korylee.github.io/blog/avatar.png'" />
    <img class="cat" v-lazy="'https://korylee.github.io/blog/avatar.png'" />
    <img class="cat" v-lazy="'https://korylee.github.io/blog/avatar.png'" />
    <img class="cat" v-lazy="'https://korylee.github.io/blog/avatar.png'" />
    <img class="cat" v-lazy="'https://korylee.github.io/blog/avatar.png'" />
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
