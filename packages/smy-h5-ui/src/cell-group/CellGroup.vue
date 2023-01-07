<template>
  <div class="smy-cell-group" :class="{ 'smy-cell-group--insert': insert }">
    <slot />
  </div>
</template>

<script>
import { props } from './props'

export default {
  name: 'SmyCellGroup',
  props,
}
</script>

<style lang="less">
@import './cellGroup.less';
</style>
