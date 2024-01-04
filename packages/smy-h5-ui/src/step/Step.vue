<template>
  <div :class="bem([status])" @click="onClick">
    <div :class="bem('header')">
      <div :class="bem('header-line')"></div>
      <div :class="bem('header-icon', { dot })">
        <slot name="icon">{{ dot ? '' : currentIndex + 1 }}</slot>
      </div>
    </div>
    <div :class="bem('main')">
      <div :class="bem('main-title')">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="content || hasSlot()" :class="bem('main-content')">
        <slot><span v-html="content"></span></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { getListener } from '../_mixins/listeners'
import { createChildrenMixin } from '../_mixins/relation'
import { createNamespace } from '../_utils/vue/create'
import { SlotsMixin } from '../_utils/vue/slots'
import { props } from './props'

const [name, bem] = createNamespace('step')

export default {
  name,
  mixins: [createChildrenMixin('steps', { children: 'step' }), SlotsMixin],
  props,
  computed: {
    dot({ steps }) {
      return steps.progressDot
    },
    currentIndex({ index, steps }) {
      const { reverse, step } = steps
      const length = step?.length ?? 0
      return reverse ? length - index - 1 : index
    },
    status({ steps, currentIndex }) {
      const { current } = steps
      const isFinish = currentIndex < +current
      if (isFinish) return 'finish'
      return currentIndex === +current ? 'process' : 'wait'
    },
    direction({ steps }) {
      return steps.direction
    },
  },
  methods: {
    bem,
    onClick() {
      const { steps, index } = this
      const clickStep = getListener.call(steps, 'click-step')
      clickStep(index)
    },
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
@import './step.less';
</style>
