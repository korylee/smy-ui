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
      <div v-if="content || hasSlot()" class="smy-step__main-content">
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
    dot({ steps }) {
      return steps.progressDot
    },
    status({ index, steps }) {
      const { step, reverse, current } = steps
      const length = step?.length ?? 0
      const currentIndex = reverse ? length - index - 1 : index
      const isFinish = currentIndex < +current
      if (isFinish) return 'finish'
      return currentIndex === +current ? 'process' : 'wait'
    },
    direction({ steps }) {
      return steps.direction
    },
  },
  methods: {
    handleClickStep() {
      const { steps, index } = this
      steps?.$emit('click-step', index)
    },
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
@import './step.less';
</style>
