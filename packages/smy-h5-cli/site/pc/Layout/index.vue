<template>
  <div class="smy-site">
    <app-header />

    <div class="smy-site-content">
      <app-sidebar :menu="menu" :menu-name="menuName" @change="handleSidebarChange" />
      <div class="smy-site-doc-container" ref="doc" :class="[!useMobile && 'smy-site-doc-container--pc-only']">
        <router-view />
      </div>

      <app-mobile v-show="useMobile" :component-name="componentName" :replace="menuName" />
    </div>
  </div>
</template>

<script>
import { get } from 'lodash-es'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import AppMobile from './AppMobile.vue'
import config from '@config'
import { MenuTypes } from '../../constant'

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
        this.componentName = this.getComponentNameByMenuName(name)
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
      const children = document.querySelector('.smy-site-sidebar')?.getElementsByClassName('smy-site-sidebar__item')
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
      this.componentName = this.getComponentNameByMenuName(menu.doc)
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

      p code,
      li code,
      table code {
        -webkit-font-smoothing: antialiased;
        word-break: keep-all;
        font-size: 15px;
        @doc-active();
        color: var(--site-config-color-primary);
      }

      table {
        width: 100%;
        margin-top: 12px;
        font-size: 14px;
        line-height: 28px;
        border-collapse: collapse;
        border-radius: 4px;
        color: var(--site-config-color-text);
        background: var(--site-config-color-bar);
        -webkit-font-smoothing: antialiased;

        th {
          padding: 8px 16px;
          font-weight: 500;
          text-align: left;
          color: var(--site-config-color-sub-text);
          font-size: 13px;
          -webkit-font-smoothing: antialiased;
          border-bottom: 1px solid var(--site-config-color-border);
        }

        td {
          padding: 8px 16px;
          font-family: Consolas, Monaco, monospace;
          border-bottom: 1px solid var(--site-config-color-border);
          color: var(--site-config-color-text);

          code {
            white-space: pre-wrap;
            padding: 0;
            font-size: 13px;
          }
        }

        em {
          color: var(--site-config-color-type);
          font-style: normal;
          font-size: 13px;
          @doc-active();
          -webkit-font-smoothing: antialiased;
        }
      }

      .doc-card {
        border-radius: 4px;
        padding: 20px;
        background: var(--site-config-color-bar);
        margin-bottom: 30px;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

        &:first-child {
          margin-top: 30px;
        }
      }
    }
  }
}
</style>
