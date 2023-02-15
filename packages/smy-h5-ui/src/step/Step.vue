<template>
  <div class="smy-step" :class="`smy-step--${status}`" @click="handleClickStep">
    <div class="smy-step__header">
      <div class="smy-step__header-line"></div>
      <div :class="{ 'smy-step__header-icon--dot': dot }" class="smy-step__header-icon">
        <slot name="icon">
          <div v-if="!dot" class="smy-step__header-icon__inner">{{ index + 1 }}</div>
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
import { createChildrenMixin } from '../_mixins/relation'
import { SlotsMixin } from '../_utils/vue/slots'
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
      const length = steps.step?.length ?? 0
      const currentIndex = steps.reverse ? length - index - 1 : index
      const isFinish = currentIndex < +steps.current
      if (isFinish) return 'finish'
      return currentIndex === +steps.current ? 'process' : 'wait'
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
