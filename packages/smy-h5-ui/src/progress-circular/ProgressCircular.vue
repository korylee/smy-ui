<template>
  <component
    ref="root"
    :is="tag"
    :class="rootClass"
    :style="rootStyle"
    :aria-valuenow="indeterminate ? undefined : normalizedValue"
    aria-valuemin="0"
    aria-valuemax="100"
    class="smy-progress-circular"
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
        class="smy-progress-circular__underlay"
        fill="transparent"
        cx="50%"
        cy="50%"
        :style="{ color: bgColor, caretColor: bgColor }"
        :r="MAGIC_RADIUS_CONSTANT"
        :stroke-dashoffset="0"
        :stroke-width="strokeWidth"
        :stroke-dasharray="CIRCUMFERENCE"
      ></circle>
      <circle
        class="smy-progress-circular__overlay"
        fill="transparent"
        cx="50%"
        cy="50%"
        :r="MAGIC_RADIUS_CONSTANT"
        :stroke-dashoffset="strokeDashOffset"
        :stroke-width="strokeWidth"
        :stroke-dasharray="CIRCUMFERENCE"
      ></circle>
      <div v-if="hasSlot()" class="smy-progress-circular__content">
        <slot name="default" :value="normalizedValue" />
      </div>
    </svg>
  </component>
</template>
<script>
import { convertToUnit } from '../_utils/dom'
import { range } from '../_utils/shared'
import { SlotsMixin } from '../_utils/vue/slots'
import { props } from './props'

const MAGIC_RADIUS_CONSTANT = 20
const CIRCUMFERENCE = 2 * Math.PI * MAGIC_RADIUS_CONSTANT

export default {
  name: 'SmyProgressCircular',
  mixins: [SlotsMixin],
  props,
  data: () => ({
    MAGIC_RADIUS_CONSTANT,
    CIRCUMFERENCE,
    internalSize: 0,
  }),
  computed: {
    rootClass({ indeterminate }) {
      return {
        'smy-progress-circular--indeterminate': !!indeterminate,
        'smy-progress-circular--disable-shrink': indeterminate === 'disable-shrink',
      }
    },
    rootStyle({ color, size }) {
      return {
        color,
        caretColor: color,
        width: convertToUnit(size),
        height: convertToUnit(size),
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
}
</script>

<style lang="less">
@import './progressCircular.less';
</style>
