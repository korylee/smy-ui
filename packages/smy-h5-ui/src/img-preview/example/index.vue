<template>
  <div>
    <button @click="show">图片预览</button>
  </div>
</template>

<script>
import { handlePreviewImg } from '../index'

let instance
export default {
  name: 'ImgPreviewExample',
  methods: {
    show() {
      instance = handlePreviewImg('https://korylee.github.io/blog/avatar.png')
    },
  },
  beforeDestroy() {
    instance && instance.close()
  },
}
</script>
