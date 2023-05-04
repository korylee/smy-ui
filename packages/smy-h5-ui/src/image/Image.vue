<template>
  <div :style="style" :class="{ 'smy--inline-block': !block }" class="smy-image smy--box">
    <img
      v-if="lazy"
      v-lazyload="{
        src,
        options: lazyOptions,
      }"
      :alt="alt"
      :style="{ objectFit: fit }"
      class="smy-image__image"
      @load="handleLoaded($event, 'load')"
      @error="handleLoaded($event, 'error')"
      @click="$emit('click', $event)"
    />
    <img
      v-else
      :src="src"
      :alt="alt"
      :style="{ objectFit: fit }"
      class="smy-image__image"
      @load="handleLoaded($event, 'load')"
      @error="handleLoaded($event, 'error')"
      @click="$emit('click', $event)"
    />
  </div>
</template>

<script>
import { convertToUnit } from '../_utils/dom'
import Lazyload, { LAZYLOAD_STATE } from '../lazyload'
import { props } from './props'

export default {
  name: 'SmyImage',
  directives: { Lazyload },
  props,
  computed: {
    style({ height, width, radius }) {
      return {
        width: convertToUnit(width),
        height: convertToUnit(height),
        borderRadius: convertToUnit(radius),
      }
    },
  },
  methods: {
    handleLoaded(event, eventName) {
      const { lazy } = this
      const el = event.currentTarget
      const { _lazy } = el
      if (lazy & _lazy) {
        const state = _lazy.state
        const lazyEventName = state === LAZYLOAD_STATE.SUCCESS ? 'load' : state === LAZYLOAD_STATE.ERROR ? 'error' : ''
        if (!lazyEventName) return
        this.$emit(lazyEventName, event)
        return
      }
      this.$emit(eventName, event)
    },
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
@import './image.less';
</style>
