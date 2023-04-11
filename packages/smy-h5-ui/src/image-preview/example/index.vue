<template>
  <div>
    <app-demo-title>函数调用</app-demo-title>
    <button @click="show">基本使用</button>
    <app-demo-title>组件调用</app-demo-title>
    <button @click="show1 = true">基本使用</button>
    <smy-image-preview :show.sync="show1" indicator :images="images" />
  </div>
</template>

<script>
import ImagePreview from '../index'
import { AppDemoTitle } from '@smy-h5/cli/client'

export default {
  name: 'ImagePreviewExample',
  components: {
    SmyImagePreview: ImagePreview.Component,
    AppDemoTitle,
  },
  data: () => ({
    show1: false,
    images: ['https://korylee.github.io/blog/avatar.png', 'https://korylee.github.io/blog/avatar.png'],
  }),
  methods: {
    show() {
      ImagePreview(this.images)
    },
  },
}
</script>
