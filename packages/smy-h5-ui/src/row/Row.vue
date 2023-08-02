<template>
  <div
    :style="{
      justifyContent: justify,
      alignItems: align,
      margin: average ? `0 -${average}px` : undefined,
      flexWrap: wrap,
    }"
    class="smy-row smy--flex smy--box"
  >
    <slot />
  </div>
</template>
<script>
import { toPxNum } from '../_utils/dom'
import { props } from './props'
import { useChildrenRelation } from '../composables/useRelation'
import { computed, nextTick, watch } from 'vue'

export default {
  name: 'SmyRow',
  props,
  setup(props) {
    const average = computed(() => toPxNum(props.gutter) / 2)
    const { children } = useChildrenRelation('cols')

    watch([() => props.gutter, () => children], () => {
      nextTick(() => {
        console.log(children)
      })
    })
    return {
      average,
    }
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
@import './row.less';
</style>
