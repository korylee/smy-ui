<template>
  <div
    :class="bem({ dashed, hairline, vertical, [`content-${contentPosition}`]: !vertical && hasSlot() })"
    role="separator"
  >
    <slot v-if="!vertical" />
  </div>
</template>

<script>
import { SlotsMixin } from '../_mixins/slots'
import { createNamespace } from '../_utils/vue/create'
import { props } from './props'

const [name, bem] = createNamespace('divider')

export default {
  name,
  mixins: [SlotsMixin],
  props,
  methods: {
    bem,
  },
}
</script>

<style lang="less">
@import './divider.less';
</style>
