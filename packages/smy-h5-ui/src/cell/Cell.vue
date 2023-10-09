<template>
  <div :class="bem({ borderless: !border, insert, clickable })" v-on="$listeners">
    <div v-if="hasSlot('icon')" :class="bem('icon')"><slot name="icon" /></div>
    <div :class="bem('content')">
      <div :class="[bem('title'), titleClass]">
        <slot>{{ title }}</slot>
      </div>
      <div v-if="hasSlot('desc') || desc" :class="[bem('desc'), descClass]">
        <slot name="desc">{{ desc }}</slot>
      </div>
    </div>
    <div v-if="hasSlot('extra')" :class="[bem('extra'), extraClass]"><slot name="extra" /></div>
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
  methods: { bem },
}
</script>

<style lang="less">
@import './cell.less';
</style>
