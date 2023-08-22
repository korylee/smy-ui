<template>
  <component
    ref="root"
    :is="tag"
    :class="bem({ indeterminate: !!indeterminate, 'disable-shrink': indeterminate === 'disable-shrink' })"
    :style="rootStyle"
    :aria-valuenow="indeterminate ? undefined : normalizedValue"
    aria-valuemin="0"
    aria-valuemax="100"
    role="progressbar"
  >
    <svg
      :style="{
        transform: `rotate(${Number(rotate) - 90}deg)`,
      }"
      :viewBox="`0 0 ${diameter} ${diameter}`"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        fill="transparent"
        cx="50%"
        cy="50%"
        :style="{ color: bgColor, caretColor: bgColor }"
        :r="MAGIC_RADIUS_CONSTANT"
        :stroke-dashoffset="0"
        :stroke-width="strokeWidth"
        :stroke-dasharray="CIRCUMFERENCE"
        :class="bem('underlay')"
      ></circle>
      <circle
        fill="transparent"
        cx="50%"
        cy="50%"
        :r="MAGIC_RADIUS_CONSTANT"
        :stroke-dashoffset="strokeDashOffset"
        :stroke-width="strokeWidth"
        :stroke-dasharray="CIRCUMFERENCE"
        :class="bem('overlay')"
      ></circle>
    </svg>
    <div v-if="hasSlot()" :class="bem('content')">
      <slot name="default" :value="normalizedValue" />
    </div>
  </component>
</template>
<script>
import { convertToUnit } from '../_utils/dom'
import { range } from '../_utils/shared'
import { createNamespace } from '../_utils/vue/create'
import { SlotsMixin } from '../_utils/vue/slots'
import { props } from './props'

const MAGIC_RADIUS_CONSTANT = 20
const CIRCUMFERENCE = 2 * Math.PI * MAGIC_RADIUS_CONSTANT

const [name, bem] = createNamespace('progress-circular')

export default {
  name,
  mixins: [SlotsMixin],
  props,
  data: () => ({
    MAGIC_RADIUS_CONSTANT,
    CIRCUMFERENCE,
    internalSize: 0,
  }),
  computed: {
    rootStyle({ color, size }) {
      return {
        color,
        caretColor: color,
        fontSize: convertToUnit(size),
      }
    },
    normalizedValue({ value }) {
      return range(value, 0, 100)
    },
    diameter({ width, internalSize }) {
      return (MAGIC_RADIUS_CONSTANT / (1 - width / internalSize)) * 2
    },
    strokeWidth({ width, internalSize, diameter }) {
      return (width / internalSize) * diameter
    },
    strokeDashOffset({ normalizedValue }) {
      return convertToUnit(((100 - normalizedValue) / 100) * CIRCUMFERENCE)
    },
  },
  watch: {
    width: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          this.internalSize = this.$refs.root?.clientWidth || 0
        })
      },
    },
  },
  methods: {
    bem,
  },
}
</script>

<style lang="less">
@import './progressCircular.less';
</style>
