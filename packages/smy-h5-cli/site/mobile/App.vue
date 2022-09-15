<template>
  <div class="site-mobile">
    <header>
      <AppBar class="app-bar">
        <template #left> </template>
      </AppBar>
    </header>
    <div class="router-view__block">
      <router-view />
    </div>
  </div>
</template>

<script>
import AppBar from './components/AppBar'

export default {
  components: { AppBar },
  watch: {
    '$route.path'(to) {
      const componentName = to.slice(1)
      console.log(componentName)
    },
  },
}
</script>

<style lang="less">
* {
  -webkit-font-smoothing: antialiased;
}
::-webkit-scrollbar {
  display: none;
  width: 0;
  background: transparent;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  font-family: 'Roboto', sans-serif;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  background: var(--site-config-color-bar);
  color: var(--site-config-color-text);
  transition: background-color 0.25s, color 0.25s;
}
</style>
