<template>
  <div :class="classes" :style="style">
    <slot></slot>
    <smy-icon v-if="closeable" size="12" @click.stop="$emit('close', $event)" class="smy-tag__close"
      ><slot name="icon"><window-close /></slot
    ></smy-icon>
  </div>
</template>

<script>
import { props } from './props'
import Icon from '../icon'
import WindowClose from '@smy-h5/icons/dist/es/WindowClose'
import { createNamespace } from '../_utils/vue/create'
import { defineComponent } from 'vue'

const [name, bem] = createNamespace('tag')

export default defineComponent({
  name,
  components: { [Icon.name]: Icon, WindowClose },
  props,
  computed: {
    classes({ type, plain, round, mark }) {
      return bem({ [type]: type, plain, round, mark })
    },
    style() {
      const style = {}
      const { textColor, color, plain } = this
      if (textColor) {
        style.color = textColor
      } else if (color && plain) {
        style.color = color
      }
      if (plain) {
        style.background = '#fff'
        style.borderColor = color
      } else if (color) {
        style.background = color
      }
      return style
    },
  },
})
</script>

<style lang="less">
@import './tag.less';
</style>
