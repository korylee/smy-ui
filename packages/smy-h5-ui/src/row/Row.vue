<template>
  <div
    :style="{
      justifyContent: justify,
      alignItems: align,
      margin: average ? `0 -${average}px` : undefined,
      flexWrap: wrap,
    }"
    :class="bem(['$--flex', '$--box'])"
    v-on="$listeners"
  >
    <slot />
  </div>
</template>
<script>
import { createParentMixin } from '../_mixins/relation'
import { toPxNum } from '../_utils/dom'
import { createNamespace } from '../_utils/vue/create'
import { props } from './props'

const [name, bem] = createNamespace('row')

export default {
  name,
  mixins: [createParentMixin('row', { children: 'cols' })],
  props,
  computed: {
    average({ gutter }) {
      return toPxNum(gutter) / 2
    },
    paddingWatcher({ average, cols }) {
      return () => {
        this.$nextTick(() => {
          cols.forEach((col) => {
            col.setPadding({ left: average, right: average })
          })
        })
      }
    },
  },

  watch: {
    paddingWatcher(run) {
      run()
    },
  },

  methods: {
    bem,
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
@import './row.less';
</style>
