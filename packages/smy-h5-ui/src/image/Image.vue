<template>
  <div :style="style" :class="bem({ '$--inline-block': !block, '$--box': true })">
    <img
      v-if="lazy"
      key="directive"
      v-lazyload="{ src, options: lazyOptions }"
      :alt="alt"
      :style="{ objectFit: fit }"
      :class="bem('image')"
      @load="onLazyloaded"
      @error="onLazyloaded"
      @click="onClick"
    />
    <img
      v-else
      key="native"
      :src="src"
      :alt="alt"
      :style="{ objectFit: fit }"
      :class="bem('image')"
      @load="onLoad"
      @error="onError"
      @click="onClick"
    />
    <div v-if="isLoading && hasSlot('loading')" :class="bem('loading')"><slot name="loading" /></div>
    <div v-else-if="isError && hasSlot('error')" :class="bem('error')"><slot name="error" /></div>
  </div>
</template>

<script>
import { convertToUnit } from '@smy-h5/shared'
import { createNamespace } from '../_utils/vue/create'
import { SlotsMixin } from '../_utils/vue/slots'
import Lazyload, { LAZYLOAD_STATE } from '../lazyload'
import { props } from './props'

const { ERROR } = LAZYLOAD_STATE
const [name, bem] = createNamespace('image')

export default {
  name,
  mixins: [SlotsMixin],
  directives: { Lazyload },
  props,
  data: () => ({
    isLoading: true,
    isError: false,
  }),
  computed: {
    style({ height, width, radius }) {
      return {
        width: convertToUnit(width),
        height: convertToUnit(height),
        borderRadius: convertToUnit(radius),
      }
    },
  },
  watch: {
    src() {
      this.isLoading = true
      this.isError = false
    },
  },
  methods: {
    bem,
    onLazyloaded(event) {
      const { lazy } = this
      const el = event.currentTarget
      const { _lazy } = el
      if (!lazy || !_lazy) return
      const state = _lazy.state
      const isError = state === ERROR
      this.isLoading = false
      this.isError = isError
      isError ? this.onError(event) : this.onLoad(event)
    },
    onLoad(event) {
      this.isLoading = false
      this.$emit('load', event)
    },
    onError(event) {
      this.isLoading = false
      this.isError = true
      this.$emit('error', event)
    },
    onClick(event) {
      this.$emit('click', event)
    },
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
@import './image.less';
</style>
