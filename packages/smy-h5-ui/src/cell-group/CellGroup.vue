<template>
  <div :class="bem({ insert })">
    <slot />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { createNamespace } from '../_utils/vue/create'
import { props } from './props'

const [name, bem] = createNamespace('cell-group')

export default defineComponent({
  name,
  props,
  setup() {
    return { bem }
  },
})
</script>

<style lang="less">
@import './cellGroup.less';
</style>
