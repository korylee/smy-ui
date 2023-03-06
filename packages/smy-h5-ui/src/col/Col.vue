<template>
  <div
    :class="{
      [`smy-col--span-${span}`]: span,
      [`smy-col--offset-${offset}`]: offset,
    }"
    :style="style"
    class="smy-col"
    v-on="$listeners"
  >
    <slot />
  </div>
</template>
<script>
import { createChildrenMixin } from '../_mixins/relation'
import { convertToUnit } from '../_utils/shared'
import { props } from './props'

export default {
  name: 'SmyCol',
  mixins: [createChildrenMixin('row', { children: 'cols' })],
  props,

  data: () => ({
    style: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  }),

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
