<template>
  <div>
    <div>函数调用</div>
    <button @click="show">基本使用</button>
    <div>组件调用</div>
    <button @click="show1 = true">基本使用</button>
    <image-preview :show.sync="show1" :images="images" />
  </div>
</template>

<script>
import ImagePreview from '../index'

export default {
  name: 'ImagePreviewExample',
  components: {
    ImagePreview: ImagePreview.Component,
  },
  data: () => ({
    show1: false,
    images: ['https://korylee.github.io/blog/avatar.png'],
  }),
  methods: {
    show() {
      ImagePreview(this.images)
    },
  },
}
</script>
