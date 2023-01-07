<template>
  <div class="smy-loading" :style="{ fontSize }">
    <div v-if="hasDefaultSlots" :class="{ 'smy-loading__content--active': loading }" class="smy-loading__content">
      <slot />
    </div>
    <div v-if="isShow" class="smy--box smy-loading__body" :class="{ 'smy-loading__inside': hasDefaultSlots }">
      <div v-if="type === 'circle'" class="smy-loading__circle">
        <smy-icon class="smy-loading__circle-block" :color="color">
          <svg class="circle-loading" viewBox="25 25 50 50">
            <circle cx="50" cy="50" r="20" fill="none"></circle>
          </svg>
        </smy-icon>
      </div>
      <div v-else-if="currentLoadingNums" :class="`smy-loading__${type}`">
        <div
          v-for="num in currentLoadingNums"
          :key="num"
          :style="{ backgroundColor: color }"
          :class="`smy-loading__${type}-item`"
        ></div>
      </div>
      <div v-if="hasSlots('description') || description" :style="{ color }" class="smy-loading__description">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
  </div>
</template>

<script>
import { SlotsMixin } from '@smy-h5/vtools'
import { props } from './props'
import { LOADING_NUMBERS_DICT } from './constant'
import SmyIcon from '../icon'
import { isNumber, isNumString } from '../_utils/is'

export default {
  name: 'SmyLoading',
  mixins: [SlotsMixin],
  components: { SmyIcon },
  props,
  computed: {
    hasDefaultSlots() {
      return this.hasSlots()
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
