<template>
  <div :class="bem({ insert })">
    <slot />
  </div>
</template>

<script>
import { createNamespace } from '../_utils/vue/create'
import { props } from './props'

const [name, bem] = createNamespace('cell-group')

export default {
  name,
  props,
  methods: {
    bem,
  },
}
</script>

<style lang="less">
@import './cellGroup.less';
</style>
