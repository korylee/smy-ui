<template>
  <div>
    <app-demo-title>基础用法</app-demo-title>
    <smy-tag>12151</smy-tag>
    <smy-tag type="primary">12151</smy-tag>
    <smy-tag type="success">12151</smy-tag>
    <smy-tag type="warning">12151</smy-tag>
    <smy-tag type="danger">12151</smy-tag>
    <app-demo-title>空心样式</app-demo-title>
    <smy-tag plain>12151</smy-tag>
    <smy-tag type="primary" plain>12151</smy-tag>
    <smy-tag type="success" plain>12151</smy-tag>
    <smy-tag type="warning" plain>12151</smy-tag>
    <smy-tag type="danger" plain>12151</smy-tag>
    <app-demo-title>圆角</app-demo-title>
    <smy-tag round>12151</smy-tag>
    <smy-tag type="primary" round>12151</smy-tag>
    <smy-tag type="success" round>12151</smy-tag>
    <smy-tag type="warning" round>12151</smy-tag>
    <smy-tag type="danger" round>12151</smy-tag>
    <app-demo-title>标记</app-demo-title>
    <smy-tag type="danger" round mark>12151</smy-tag>
    <app-demo-title>可被关闭的</app-demo-title>
    <smy-tag type="danger" round plain closeable>12151</smy-tag>
    <app-demo-title>颜色自定义</app-demo-title>
    <smy-tag color="#FA685D">12151</smy-tag>
    <smy-tag color="#E9E9E9" text-color="#999">12151</smy-tag>
    <smy-tag color="#FA2400" plain>12151</smy-tag>
  </div>
</template>

<script>
import Tag from '../Tag.vue'
import { AppDemoTitle } from '@smy-h5/cli/client'

export default {
  name: 'TagExample',
  components: { [Tag.name]: Tag, AppDemoTitle },
}
</script>

<style></style>
