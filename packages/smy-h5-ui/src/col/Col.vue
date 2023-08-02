<template>
  <div :class="bem({ [`span-${span}`]: span, [`offset-${offset}`]: offset })" :style="{ paddingLeft, paddingRight }">
    <slot />
  </div>
</template>
<script>
import { defineComponent, ref } from 'vue'
import { convertToUnit } from '../_utils/dom'
import { createNamespace } from '../_utils/vue/create'
import { props } from './props'
import { useParentRelation } from '../composables/useRelation'

const [name, bem] = createNamespace('col')

export default defineComponent({
  name,
  props,
  setup(props, { expose }) {
    const paddingLeft = ref(null)
    const paddingRight = ref(null)

    useParentRelation('cols')

    const setPadding = (left, right) => {
      paddingLeft.value = convertToUnit(left)
      paddingRight.value = convertToUnit(right)
    }
    expose({
      setPadding,
    })
    return {
      paddingLeft,
      paddingRight,
      bem,
    }
  },
})
</script>

<style lang="less">
@import '../_styles/common.less';
@import './col.less';
</style>
