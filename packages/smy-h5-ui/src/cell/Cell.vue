<template>
  <div :class="{ 'smy-cell--border': border }" v-on="$listeners" class="smy-cell">
    <div v-if="$slots.icon" class="smy-cell__icon">
      <slot name="icon" />
    </div>
    <div class="smy-cell__content">
      <div class="smy-cell__title" :class="[titleClass ? titleClass : null]">
        <slot>{{ title }}</slot>
      </div>
      <div class="smy-cell__desc" :class="[descClass ? descClass : null]" v-if="$slots.desc || desc">
        <slot name="desc">
          {{ desc }}
        </slot>
      </div>
    </div>
    <div v-if="$slots.extra" class="smy-cell__extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<script>
import { props } from './props'

export default {
  name: 'SmyCell',
  props,
}
</script>

<style lang="less">
@import './cell.less';
</style>
