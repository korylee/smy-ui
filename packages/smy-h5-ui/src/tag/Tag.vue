<template>
  <div :class="bem({ [type]: type, plain, round, mark })" :style="style" @click="$emit('click', $event)">
    <slot></slot>
    <slot name="icon">
      <smy-icon
        v-if="closeable"
        :name="closeIcon"
        :class="bem('close')"
        size="12"
        @click.stop="$emit('close', $event)"
      />
    </slot>
  </div>
</template>

<script>
import { props } from './props'
import Icon from '../icon'
import { createNamespace } from '../_utils/vue/create'

const [name, bem] = createNamespace('tag')

export default {
  name,
  components: { [Icon.name]: Icon },
  props,
  computed: {
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
  methods: {
    bem,
  },
}
</script>

<style lang="less">
@import './tag.less';
</style>
