<template>
  <div :class="bem({ border, insert, clickable })">
    <div v-if="$slots.icon" class="smy-cell__icon">
      <slot name="icon" />
    </div>
    <div class="smy-cell__content">
      <div class="smy-cell__title" :class="titleClass">
        <slot>{{ title }}</slot>
      </div>
      <div v-if="$slots.desc || desc" class="smy-cell__desc" :class="descClass">
        <slot name="desc">{{ desc }}</slot>
      </div>
    </div>
    <div v-if="$slots.extra" :class="extraClass" class="smy-cell__extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<script>
import { createNamespace } from '../_utils/vue/create'
import { props } from './props'

const [name, bem] = createNamespace('cell')

export default {
  name,
  props,
  setup() {
    return { bem }
  },
}
</script>

<style lang="less">
@import './cell.less';
</style>
