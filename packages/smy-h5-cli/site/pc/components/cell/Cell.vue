<template>
  <div class="smy-site-cell">
    <div class="var-site-cell__content">
      <div class="var-site-cell__title" :class="titleClass">
        <slot>{{ title }}</slot>
      </div>
      <div class="var-site-cell__desc" :class="descClass" v-if="hasSlots('desc') || desc">
        <slot name="desc">
          {{ desc }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { props } from './props'
export default {
  name: 'SmySiteCell',
  components: {},
  props,
  methods: {
    hasSlots(name = 'default') {
      return this.$scopedSlots[name] || this.$slots[name]
    },
  },
}
</script>

<style lang="less">
@import './cell.less';
</style>
