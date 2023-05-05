<template>
  <div class="smy-loading">
    <div v-if="hasDefaultSlots" :class="{ 'smy-loading__content--active': loading }" class="smy-loading__content">
      <slot />
    </div>
    <div v-if="isShow" class="smy--box smy-loading__body" :class="{ 'smy-loading__inside': hasDefaultSlots }">
      <smy-progress-circular v-if="type === 'circle'" :color="color" :size="size" indeterminate width="2" />
      <div v-else-if="currentLoadingNums" :class="`smy-loading__${type}`" :style="{ fontSize }">
        <div
          v-for="num in currentLoadingNums"
          :key="num"
          :style="{ backgroundColor: color }"
          :class="`smy-loading__${type}-item`"
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
import { isNumber, isNumString } from '../_utils/is'
import { SlotsMixin } from '../_utils/vue/slots'
import SmyProgressCircular from '../progress-circular'

export default {
  name: 'SmyLoading',
  mixins: [SlotsMixin],
  components: { SmyProgressCircular },
  props,
  computed: {
    hasDefaultSlots() {
      return this.hasSlot()
    },
    isShow() {
      if (!this.hasDefaultSlots) return true
      return this.loading
    },
    currentLoadingNums() {
      return LOADING_NUMBERS_DICT[this.type]
    },
    fontSize({ size }) {
      if (!size) return undefined
      if (isNumber(size) || isNumString(size)) return size + 'px'
      return size
    },
  },
}
</script>
<style lang="less">
@import '../_styles/common.less';
@import './loading.less';
</style>
