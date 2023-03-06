<template>
  <div :style="style" class="smy-row smy--flex smy--box" v-on="$listeners">
    <slot />
  </div>
</template>
<script>
import { createParentMixin } from '../_mixins/relation'
import { toPxNum } from '../_utils/shared'
import { props } from './props'

export default {
  name: 'SmyRow',
  mixins: [createParentMixin('row', { children: 'cols' })],
  props,
  computed: {
    average() {
      return toPxNum(this.gutter) / 2
    },
    computePaddingWaterDispatcher() {
      return [this.gutter, this.cols]
    },
    style() {
      const { average } = this
      return {
        justifyContent: this.justify,
        alignItems: this.align,
        margin: average ? `0 -${average}px` : undefined,
        flexWrap: this.wrap,
      }
    },
  },

  watch: {
    computePaddingWaterDispatcher() {
      this.$nextTick(() => {
        const { average } = this
        this.cols.forEach((col) => {
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
