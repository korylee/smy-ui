<template>
  <div class="smy-site">
    <AppHeader />

    <div class="smy-site-content">
      <AppSidebar :menu="menu" :menu-name="menuName" @change="handleSidebarChange" />
      <div class="smy-site-doc-container" ref="doc" :class="[!useMobile && 'smy-site-doc-container--pc-only']">
        <router-view />
      </div>

      <AppMobile v-show="useMobile" :component-name="componentName" :replace="menuName" />
    </div>
  </div>
</template>

<script>
import { get } from 'lodash-es'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import AppMobile from './AppMobile.vue'
import config from '@config'

export default {
  name: 'Layout',
  components: { AppHeader, AppSidebar, AppMobile },
  data: () => ({
    menu: get(config, 'pc.menu', []),
    useMobile: get(config, 'useMobile'),
    mobileRedirect: get(config, 'mobile.redirect'),
    componentName: null,
    menuName: '',
  }),
  watch: {
    '$route.path': {
      immediate: true,
      handler() {
        const { name } = this.$route
        if (!name) return
        this.menuName = name
        document.title = get(config, 'pc.title')
      },
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const { name } = this.$route
      await this.$nextTick()
      const children = document.querySelector('.smy-site-sidebar')?.getElementsByClassName('smy-site-cell')
      if (!children) return
      const index = this.menu.findIndex((item) => item.doc === name)
      if (index === -1) return
      children[index].scrollIntoView({
        block: 'center',
        inline: 'start',
      })
    },
    handleSidebarChange(menu) {
      this.$refs.doc.scrollTop = 0
      this.menuName = menu.doc
    },
  },
}
</script>

<style lang="less">
@doc-active: {
  display: inline;
  font-family: inherit;
  padding: 0;
  white-space: pre-wrap;
};

.smy {
  &-component-preview {
    margin-top: 20px;
  }
  &-site {
    min-width: 1200px;
    padding: 60px 0 0;
    &-content {
      display: flex;
      margin-left: 240px;
      min-height: calc(100vh - 60px);
      background: var(--site-config-color-body);
    }
    &-doc-container {
      flex: 1 0 0;
      min-width: 500px;
      padding: 0 25px;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        display: none;
      }
      &--pc-only {
        padding: 0 90px 0 30px;
      }
    }
    &-doc {
      a {
        -webkit-font-smoothing: antialiased;
        color: var(--site-config-color-link);
        font-size: 15px;
        word-break: keep-all;
        @doc-active();

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
