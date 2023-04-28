<template>
  <div class="smy-image smy--box">
    <img
      v-if="lazy"
      v-lazyload="{
        src,
        options: lazyOptions,
      }"
      class="smy-image__image"
      @load="handleLoaded($event, 'load')"
      @error="handleLoaded($event, 'error')"
      @click="$emit('click', $event)"
    />
    <img
      v-else
      :src="src"
      class="smy-image__image"
      @load="handleLoaded($event, 'load')"
      @error="handleLoaded($event, 'error')"
      @click="$emit('click', $event)"
    />
  </div>
</template>

<script>
import Lazyload from '../lazyload'
import { props } from './props'

export default {
  name: 'SmyImage',
  directives: { Lazyload },
  props,
  computed: {
    style() {
      return {}
    },
  },
  watch: {},
  methods: {
    handleLoaded(event, eventName) {
      const { lazy } = this
      const el = event.currentTarget
      const { _lazy } = el
      if (lazy & _lazy) {
        const state = _lazy.state
        const lazyEventName = state === 'success' ? 'load' : state === 'error' ? 'error' : ''
        if (!lazyEventName) return
        this.$emit(lazyEventName, event)
        return
      }
      this.$emit(eventName, event)
    },
  },
}
</script>

<style lang="less"></style>
