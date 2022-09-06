<template>
  <button class="smy-site-button smy-box" @click="handleClick">
    <div class="smy-site-button__content">
      <slot></slot>
    </div>
  </button>
</template>

<script>
export default {
  name: 'SmySiteButton',
  components: {},
  methods: {
    handleClick(e) {
      this.$listeners.click?.(e)
    },
  },
}
</script>
