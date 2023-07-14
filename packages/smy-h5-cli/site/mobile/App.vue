<template>
  <div class="site-mobile">
    <header class="nav">
      <app-bar class="app-bar" :title="title">
        <template #left><site-icon v-if="showBackIcon" @click="onBack"></site-icon></template>
      </app-bar>
    </header>
    <router-view class="router-view__block" />
  </div>
</template>

<script>
import { upperFirst, camelCase } from 'lodash-es'
import AppBar from './components/app-bar'
import { getBrowserTheme, setTheme } from '../utils/theme'
import config from '@config'
import SiteIcon from '../components/icon'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
// import { ArrowLeft } from '@smy-h5/icons'

const themeKey = config?.themeKey

export default {
  components: { AppBar, SiteIcon },
  setup() {
    const title = ref('')
    const showBackIcon = ref(false)
    const redirect = config?.mobile?.redirect ?? ''
    const currentTheme = getBrowserTheme(themeKey)
    const route = useRoute()
    setTheme(config, currentTheme)

    watch(
      () => route.path,
      (to) => {
        const componentName = to.slice(1)
        const redirectName = redirect.slice(1)
        const isRedirect = redirectName === componentName
        showBackIcon.value = !isRedirect
        title.value = isRedirect ? '' : upperFirst(camelCase(componentName))
      }
    )

    function onBack() {
      const { redirect } = this
      window.location.href = `./mobile.html#${redirect}&replace=${redirect.slice(1)}`
    }
    return {
      title,
      showBackIcon,
      onBack,
    }
  },
}
</script>

<style lang="less">
@import './styles/common.less';

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
  background: rgb(247, 248, 250);
  overflow: hidden auto;
  box-sizing: border-box;
}
</style>
