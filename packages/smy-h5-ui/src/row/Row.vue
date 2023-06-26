<template>
  <div :style="style" class="smy-row smy--flex smy--box" v-on="$listeners">
    <slot />
  </div>
</template>
<script>
import { createParentMixin } from '../_mixins/relation'
import { toPxNum } from '../_utils/dom'
import { props } from './props'

export default {
  name: 'SmyRow',
  mixins: [createParentMixin('row', { children: 'cols' })],
  props,
  computed: {
    average({ gutter }) {
      return toPxNum(gutter) / 2
    },
    paddingWatchDispatcher({ gutter, cols }) {
      return [gutter, cols]
    },
    style({ average, justify, align, wrap }) {
      return {
        justifyContent: justify,
        alignItems: align,
        margin: average ? `0 -${average}px` : undefined,
        flexWrap: wrap,
      }
    },
  },

  watch: {
    paddingWatchDispatcher() {
      const { average, cols } = this
      this.$nextTick(() => {
        cols.forEach((col) => {
          col.setPadding({ left: average, right: average })
        })
      })
    },
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
@import './row.less';
</style>
