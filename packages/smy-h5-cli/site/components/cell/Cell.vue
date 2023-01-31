<template>
  <div class="smy-site-cell">
    <div class="smy-site-cell__content">
      <div class="smy-site-cell__title">
        <slot>{{ title }}</slot>
      </div>
      <div v-if="$slots.desc || desc" class="smy-site-cell_desc">
        <slot name="desc">{{ desc }}</slot>
      </div>
    </div>
  </div>
</template>

<script>
import { props } from './props'

export default {
  name: 'SmySiteCell',
  props,
}
</script>

<style lang="less">
@import './cell.less';
</style>
