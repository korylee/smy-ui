<template>
  <div>
    图标尺寸
    <div>
      <smy-icon size="15" name="window-close" />
      <smy-icon size="30" name="window-close" />
    </div>
    图标颜色
    <div>
      <smy-icon color="#2979ff" size="15" name="window-close" />
      <smy-icon color="#2979ff" size="30" name="window-close" />
    </div>
    使用图片
    <div>
      <smy-icon color="#2979ff" size="30">
        <img src="https://korylee.github.io/blog/avatar.png" />
      </smy-icon>
    </div>
    图标切换动画(仅iconfont方式)
    <div>
      <smy-icon color="#2979ff" size="30" :transition="300" :name="iconName" @click="toggle" />
    </div>
    组件引入使用
    <div>
      <smy-icon v-for="icon of iconList" :key="icon.name" size="35">
        <component :is="icon.value" />
      </smy-icon>
    </div>
    iconfont使用
    <div>
      <smy-icon v-for="icon of iconList" :key="icon.name" :name="icon.name" size="35" />
    </div>
  </div>
</template>

<script>
import SmyIcon from '../'
import * as icons from '@smy-h5/icons'
import { kebabCase } from 'lodash-es'

import '@smy-h5/icons/css'

const iconList = Object.keys(icons).map((iconName) => {
  return {
    value: icons[iconName],
    name: kebabCase(iconName),
  }
})

export default {
  name: 'IconExample',
  components: { SmyIcon },
  data: () => ({
    iconList,
    iconName: 'plus',
  }),
  methods: {
    toggle() {
      this.iconName = this.iconName === 'plus' ? 'minus' : 'plus'
    },
  },
}
</script>

<style lang="less"></style>
