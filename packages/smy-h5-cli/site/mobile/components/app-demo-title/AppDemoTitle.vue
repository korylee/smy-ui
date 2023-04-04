<template>
  <div class="app-demo-title">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'AppDemoTitle',
}
</script>

<style>
.app-demo-title {
  width: 100%;
  padding: 15px 10px;
  color: var(--site-config-color-sub-text);
  font-size: 14px;
}
</style>
