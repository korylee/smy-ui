<template>
  <div :class="bem()">
    <div v-if="hasDefaultSlot" :class="bem('content', { active: loading })"><slot /></div>
    <div
      v-if="isShow"
      class="smy--box"
      :class="bem('body', { inside: hasDefaultSlot })"
      :style="{ fontSize: convertToUnit(size) }"
    >
      <smy-progress-circular
        v-if="type === 'circle'"
        :class="bem(type)"
        :color="color"
        :size="size"
        indeterminate
        width="1.4"
      />
      <div v-else-if="currentLoadingNums" :class="bem(type)">
        <div
          v-for="num in currentLoadingNums"
          :key="num"
          :style="{ backgroundColor: color }"
          :class="bem(`${type}-item`)"
        ></div>
      </div>
      <div v-if="hasSlot('desc') || desc" class="smy-loading__desc">
        <slot name="desc">{{ desc }}</slot>
      </div>
    </div>
  </div>
</template>

<script>
import { props } from './props'
import { LOADING_NUMBERS_DICT } from './constant'
import { SlotsMixin } from '../_utils/vue/slots'
import SmyProgressCircular from '../progress-circular'
import { createNamespace } from '../_utils/vue/create'
import { convertToUnit } from '../_utils/dom'

const [name, bem] = createNamespace('loading')

export default {
  name,
  mixins: [SlotsMixin],
  components: { SmyProgressCircular },
  props,
  computed: {
    hasDefaultSlot() {
      return this.hasSlot()
    },
    isShow() {
      if (!this.hasDefaultSlot) return true
      return this.loading
    },
    currentLoadingNums() {
      return LOADING_NUMBERS_DICT[this.type]
    },
  },
  methods: {
    bem,
    convertToUnit,
  },
}
</script>
<style lang="less">
@import '../_styles/common.less';
@import './loading.less';
</style>
