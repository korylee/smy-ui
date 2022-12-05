<template>
  <div class="smy-step" :class="`smy-step--${status}`" @click="handleClickStep">
    <div class="smy-step__header">
      <div class="smy-step__header-line"></div>
      <div :class="{ 'smy-step__header-icon--dot': dot }" class="smy-step__header-icon">
        <slot name="icon">
          <div class="smy-step__header-icon__inner">{{ index }}</div>
        </slot>
      </div>
    </div>
    <div class="smy-step__main">
      <div class="smy-step__main-title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="content || hasSlots()" class="smy-step__main-content">
        <slot><span v-html="content"></span></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { SlotsMixin } from '@smy-h5/vtools'
import { createChildrenMixin } from '../_utils/mixins/relation'
import { props } from './props'

export default {
  name: 'SmyStep',
  mixins: [createChildrenMixin('steps', { children: 'step' }), SlotsMixin],
  props,
  computed: {
    dot() {
      return this.steps.progressDot
    },
    status() {
      const { index, steps } = this
      if (index < +steps.current) return 'finish'
      return index === +steps.current ? 'process' : 'wait'
    },
    direction() {
      return this.steps.direction
    },
  },
  methods: {
    handleClickStep() {
      this.steps?.$listeners?.['clickStep']?.(this.index)
    },
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
@import './step.less';
</style>
