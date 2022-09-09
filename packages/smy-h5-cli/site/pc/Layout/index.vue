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
import { MenuTypes } from '../common'

export default {
  name: 'Layout',
  components: { AppHeader, AppSidebar, AppMobile },
  data: () => ({
    menu: get(config, 'pc.menu', []),
    useMobile: get(config, 'useMobile'),
    mobileRedirect: get(config, 'mobile.redirect', ''),
    componentName: '',
    menuName: '',
  }),
  watch: {
    '$route.path': {
      immediate: true,
      handler() {
        const { name } = this.$route
        if (!name) return
        this.compoentName = this.getComponentNameByMenuName(name)
        this.menuName = name
        document.title = get(config, 'pc.title')
      },
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    getComponentNameByMenuName(menuName) {
      const currentMenu = this.menu.find((menu) => menu.doc === menuName)
      return currentMenu?.type === MenuTypes.COMPONENT ? menuName : this.mobileRedirect.slice(1)
    },
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
      this.compoentName = this.getComponentNameByMenuName(menu.doc)
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

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        position: relative;
        font-weight: normal;
        line-height: 0.5;
        color: var(--site-config-color-text);
      }

      h1 {
        line-height: 40px;
        font-size: 30px;
        cursor: default;
      }

      h2 {
        margin: 30px 0 20px;
        font-size: 25px;
      }

      h3 {
        font-size: 18px;
        margin: 0;
      }

      h4 {
        margin: 18px 0 0;
      }

      pre {
        margin: 0;
      }
      code {
        position: relative;
        display: block;
        padding: 10px 16px;
        overflow-x: auto;
        font-size: 13px;
        font-family: Consolas, Monaco, monospace;
        white-space: pre-wrap;
        word-wrap: break-word;
        color: var(--site-config-color-hl-code);
      }
      .card {
        border-radius: 4px;
        padding: 20px;
        background: var(--site-config-color-bar);
        margin-bottom: 30px;
        box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
        &:first-child {
          margin-top: 30px;
        }
      }
    }
  }
}
</style>
