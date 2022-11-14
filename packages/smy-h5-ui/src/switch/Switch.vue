<template>
  <div
    class="smy-switch"
    :class="{ [`smy-switch--${size}`]: size, 'smy-switch--active': isActive }"
    @click="handleToggle"
  >
    <div class="smy-switch__btn"></div>
    <div class="smy-switch__label">{{ isActive ? labelArr[0] : labelArr[1] }}</div>
  </div>
</template>

<script>
export default {
  name: 'SmySwitch',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    size: String,
    label: String,
  },
  computed: {
    isActive: {
      get() {
        return this.active
      },
      set(val) {
        this.$emit('change', val)
        this.$emit('update:active', val)
      },
    },
    labelArr() {
      return this.label?.split?.('|') ?? []
    },
  },
  methods: {
    handleToggle() {
      if (this.disabled) return
      this.isActive = !this.isActive
    },
  },
}
</script>

<style lang="less">
@import './switch.less';
</style>
