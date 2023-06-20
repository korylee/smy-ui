<template>
  <div :class="classes" :style="style" v-on="$listeners">
    <slot />
  </div>
</template>
<script>
import { createChildrenMixin } from '../_mixins/relation'
import { convertToUnit } from '../_utils/dom'
import { createNamespace } from '../_utils/vue/create'
import { props } from './props'

const [name, bem] = createNamespace('col')

export default {
  name,
  mixins: [createChildrenMixin('row', { children: 'cols' })],
  props,

  data: () => ({
    style: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  }),

  computed: {
    classes({ span, offset }) {
      return bem({
        [`span-${span}`]: span,
        [`offset-${offset}`]: offset,
      })
    },
  },

  methods: {
    setPadding({ left, right }) {
      this.style = {
        paddingLeft: convertToUnit(left),
        paddingRight: convertToUnit(right),
      }
    },
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
@import './col.less';
</style>
