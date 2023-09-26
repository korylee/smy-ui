<template>
  <div v-on="$listeners" class="smy-site-cell">
    <div v-if="$slots.icon" class="smy-site-cell__icon">
      <slot name="icon" />
    </div>
    <div class="smy-site-cell__content">
      <div class="smy-site-cell__title">
        <slot>{{ title }}</slot>
      </div>
      <div v-if="$slots.desc || desc" class="smy-site-cell_desc">
        <slot name="desc">{{ desc }}</slot>
      </div>
    </div>
    <div v-if="$slots.extra" class="smy-site-cell__extra">
      <slot name="extra"> </slot>
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
