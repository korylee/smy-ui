<template>
  <div class="lazy-example">
    <smy-lazy v-for="item of 4" :key="item" @input="onInput(item)">
      <div>{{ item }}</div>
    </smy-lazy>
  </div>
</template>

<script>
import SmyLazy from '..'
import Toast from '../../toast'

export default {
  name: 'LazyExample',
  components: { SmyLazy },
  methods: {
    onInput(item) {
      Toast('渲染第' + item)
    },
  },
}
</script>

<style lang="less" scoped>
.lazy-example {
  overflow-y: scroll;
  padding: 5px;
}

.smy-lazy {
  box-sizing: content-box;
  height: 500px;
  width: 100%;
  text-align: center;
  font-size: 24px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.6);
}
</style>
