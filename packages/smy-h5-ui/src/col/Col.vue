<template>
  <div :class="bem({ [`span-${span}`]: span, [`offset-${offset}`]: offset })" :style="style" v-on="$listeners">
    <slot />
  </div>
</template>
<script>
import { createChildrenMixin } from '../_mixins/relation'
import { convertToUnit } from '@smy-h5/shared'
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

  methods: {
    bem,
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
