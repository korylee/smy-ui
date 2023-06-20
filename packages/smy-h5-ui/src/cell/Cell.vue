<template>
  <div :class="classes" v-on="$listeners">
    <div v-if="hasSlot('icon')" class="smy-cell__icon"><slot name="icon" /></div>
    <div class="smy-cell__content">
      <div class="smy-cell__title" :class="titleClass">
        <slot>{{ title }}</slot>
      </div>
      <div v-if="hasSlot('desc') || desc" class="smy-cell__desc" :class="descClass">
        <slot name="desc">{{ desc }}</slot>
      </div>
    </div>
    <div v-if="hasSlot('extra')" :class="extraClass" class="smy-cell__extra"><slot name="extra" /></div>
  </div>
</template>

<script>
import { createNamespace } from '../_utils/vue/create'
import { SlotsMixin } from '../_utils/vue/slots'
import { props } from './props'

const [name, bem] = createNamespace('cell')

export default {
  name,
  mixins: [SlotsMixin],
  props,
  computed: {
    classes({ border, clickable, insert }) {
      return bem({
        border,
        insert,
        clickable,
      })
    },
  },
}
</script>

<style lang="less">
@import './cell.less';
</style>
