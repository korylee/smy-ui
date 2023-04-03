<template>
  <div class="smy-site-header">
    <div class="smy-site-header__lead" @click="handleBackRoot">
      <div v-if="title" class="smy-site-header__title">{{ title }}</div>
    </div>
  </div>
</template>

<script>
import config from '@config'
import { get } from 'lodash-es'
import { setThemes, getBrowserThemes } from '../../utils'

export default {
  name: 'AppHeader',
  data: () => ({
    title: get(config, 'title'),
    redirect: get(config, 'pc.redirect'),
    currentThemes: getBrowserThemes(get(config, 'themesKey')),
  }),
  created() {
    setThemes(config, this.currentThemes)
  },
  methods: {
    handleBackRoot () {
      this.$router.replace(`/${this.redirect}`)
    }
  }
}
</script>

<style lang="less" scoped>
.fade-enter-active {
  animation-name: fade-in;
  animation-duration: 0.3s;
}

@keyframes fade-in {
  0% {
    top: 30px;
    opacity: 0;
  }
  100% {
    top: 40px;
    opacity: 1;
  }
}

.smy-site-header {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 0 30px;
  justify-content: space-between;
  user-select: none;
  z-index: 6;
  box-sizing: border-box;
  border-bottom: 1px solid var(--site-config-color-border);
  background: var(--site-config-color-bar);

  &__lead {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}
</style>
