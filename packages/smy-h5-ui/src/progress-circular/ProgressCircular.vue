<template>
  <component
    ref="root"
    :is="tag"
    :class="bem({ indeterminate, 'disable-shrink': indeterminate === 'disable-shrink' })"
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
    <div v-if="$slots.default" :class="bem('content')">
      <slot name="default" :value="normalizedValue" />
    </div>
  </component>
</template>
<script lang="ts">
import { computed, defineComponent, nextTick, ref, watch } from 'vue'
import { convertToUnit, toPxNum } from '../_utils/dom'
import { assign, range } from '../_utils/shared'
import { getSizeStyle } from '../_utils/style'
import { createNamespace } from '../_utils/vue/create'
import { props } from './props'

const MAGIC_RADIUS_CONSTANT = 20
const CIRCUMFERENCE = 2 * Math.PI * MAGIC_RADIUS_CONSTANT

const [name, bem] = createNamespace('progress-circular')

export default defineComponent({
  name,
  props,
  setup(props) {
    const internalSize = ref(0)
    const root = ref<HTMLElement>()
    const rootStyle = computed(() => {
      const { color, size } = props

      return assign({ color, caretColor: color }, getSizeStyle(size))
    })
    const normalizedValue = computed(() => range(+props.value, 0, 100))
    const diameter = computed(() => (MAGIC_RADIUS_CONSTANT / (1 - toPxNum(props.width) / internalSize.value)) * 2)
    const strokeWidth = computed(() => (toPxNum(props.width) / internalSize.value) * diameter.value)
    const strokeDashOffset = computed(() => convertToUnit(((100 - normalizedValue.value) / 100) * CIRCUMFERENCE))

    watch(
      () => props.width,
      () => {
        nextTick(() => {
          internalSize.value = root.value?.clientWidth || 0
        })
      },
      { immediate: true }
    )
    return {
      MAGIC_RADIUS_CONSTANT,
      CIRCUMFERENCE,
      internalSize,
      root,
      rootStyle,
      normalizedValue,
      diameter,
      strokeWidth,
      strokeDashOffset,
      bem,
    }
  },
})
</script>

<style lang="less">
@import './progressCircular.less';
</style>
