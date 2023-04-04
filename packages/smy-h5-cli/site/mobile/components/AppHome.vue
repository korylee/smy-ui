<template>
  <div class="app-home">
    <div class="app-home__components">
      <smy-site-cell v-for="component of components" :key="component.doc" class="component-cell"
        @click="toComponent(component)">
        {{ component.text }}
        <template #extra>
          <svg class="smy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" aria-labelledby="right"
            role="presentation" style="color: rgb(151, 151, 151);">
            <path
              d="M381.262 1005.566c-16.132 21.51-45.708 24.198-67.217 8.066-21.51-16.132-24.198-45.708-8.066-67.217C413.526 806.604 518.384 666.792 625.932 529.67c8.066-10.755 8.066-24.198 0-34.953C518.384 354.906 413.526 215.094 305.979 77.972c-16.132-21.51-10.755-51.085 8.066-67.217C335.555-5.377 365.13 0 381.262 18.82c107.547 142.5 212.405 282.311 319.953 419.434 34.952 43.019 34.952 104.858 0 150.566-107.548 139.811-212.406 279.622-319.953 416.745"
              fill="currentColor" fill-opacity="0.9"></path>
          </svg>
        </template>
      </smy-site-cell>
    </div>
  </div>
</template>

<script>
import config from "@config"
import { MenuTypes } from "../../constant";
import { inIframe, isPhone } from "../../utils";
import SmySiteCell from '../../components/cell'

export default {
  name: 'AppHome',
  components: { SmySiteCell },
  data: () => ({
    platform: 'mobile',
  }),
  computed: {
    components: () => (config?.pc?.menu ?? []).filter(item => item.type === MenuTypes.COMPONENT)
  },
  methods: {
    toComponent (component) {
      this.$router.push({
        path: `/${component.doc}`,
        query: {
          platform: this.platform,
          replace: component.doc
        },
      })

      if (!isPhone() && inIframe()) {
        window.top?.scrollToMenu(component.doc)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.app-home {
  &__components {
    box-sizing: border-box;
    background: #f7f8fa;
    border-radius: 30px 30px 0 0;
    overflow: hidden;
    padding: 30px 25px;
  }

  .component-cell {
    cursor: pointer;
  }
}

.smy-icon {
  font-size: 12px;
  width: 1em;
  height: 1em;
}
</style>
