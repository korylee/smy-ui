<template>
  <div class="site-mobile">
    <header class="nav">
      <app-bar class="app-bar" :title="title"> </app-bar>
    </header>
    <div class="router-view__block">
      <router-view />
    </div>
  </div>
</template>

<script>
import { upperFirst } from 'lodash-es'
import AppBar from './components/app-bar'
import { getBrowserTheme, setTheme } from '../utils/theme'
import config from '@config'

const themeKey = config?.themeKey

export default {
  components: { AppBar },
  data: () => ({
    title: '',
    currentTheme: getBrowserTheme(themeKey),
  }),
  watch: {
    '$route.path' (to) {
      const componentName = to.slice(1)
      this.title = upperFirst(componentName)
    },
  },
  created() {
    setTheme(config, this.currentTheme)
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

.nav {
  position: fixed;
  z-index: 10;
  width: 100%;
  left: 0;
  right: 0;
  text-align: center;
  font-weight: bold;
  // background: rgb(255, 255, 255);
  font-size: 20px;
  // color: rgb(51, 51, 51);
  box-shadow: rgb(0 0 0 / 7%) 0px 4px 10px;
}

.router-view__block {
  padding-top: var(--site-app-bar-height);
  min-height: 100vh;
  // background: rgb(247, 248, 250);
  overflow: hidden auto;
  box-sizing: border-box;
}
</style>
