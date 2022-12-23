<template>
  <div class="smy-loading">
    <div v-if="hasDefaultSlots" :class="{ 'smy-loading__content--active': loading }" class="smy-loading__content">
      <slot />
    </div>
    <div v-if="isShow" class="smy--box smy-loading__body" :class="{ 'smy-loading__inside': hasDefaultSlots }">
      <div v-if="type === 'circle'" class="smy-loading__circle">
        <Icon class="smy-loading__circle-block" :color="color" :size="getRadius * 2">
          <svg class="circle-loading-c92e" viewBox="25 25 50 50">
            <circle cx="50" cy="50" r="20" fill="none"></circle>
          </svg>
        </Icon>
      </div>
      <div v-else-if="currentLoadingNums" :class="`smy-loading__${type} smy-loading__${type}--${size}`">
        <div
          v-for="num in currentLoadingNums"
          :key="num"
          :style="{ backgroundColor: color }"
          :class="`smy-loading__${type}-item smy-loading__${type}-item--${size}`"
        ></div>
      </div>
      <div
        v-if="hasSlots('description') || description"
        :class="`smy-loading__description--${size}`"
        :style="{ color }"
        class="smy-loading__description"
      >
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
  </div>
</template>

<script>
import { SlotsMixin } from '@smy-h5/vtools'
import { props } from './props'
import { LOADING_NUMBERS_DICT, LOADING_SIZE_DICT } from './constant'
import { toNumber } from '../_utils/shared'
import Icon from '../icon'

export default {
  name: 'SmyLoading',
  mixins: [SlotsMixin],
  components: { Icon },
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
    getRadius({ radius, size }) {
      return radius ? toNumber(radius) : LOADING_SIZE_DICT[size]
    },
  },
}
</script>
<style lang="less">
@import '../_styles/common.less';
@import './loading.less';
</style>
