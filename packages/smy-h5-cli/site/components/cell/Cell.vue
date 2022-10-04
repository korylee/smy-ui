<template>
  <div class="smy-site-cell">
    <div class="smy-site-cell__content">
      <div class="smy-site-cell__title">
        <slot>{{ title }}</slot>
      </div>
      <div v-if="hasSlots('desc') || desc" class="smy-site-cell_desc">
        <slot name="desc">{{ desc }}</slot>
      </div>
    </div>
  </div>
</template>

<script>
import { SlotsMixin } from '@smy-h5/vtools'
import { props } from './props'

SlotsMixin
export default {
  name: 'SmySiteCell',
  mixins: [SlotsMixin],
  props,
}
</script>

<style lang="less">
@import './cell.less';
</style>
