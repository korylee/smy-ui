<template>
  <div class="app-home">
    <div class="app-home__components">
      <smy-site-cell
        v-for="component of components"
        :key="component.doc"
        class="component-cell"
        @click="toComponent(component)"
      >
        {{ component.text }}
        <template #extra>
          <smy-site-icon color="rgba(151, 151, 151, 0.9)"><arrow-right /></smy-site-icon
        ></template>
      </smy-site-cell>
    </div>
  </div>
</template>

<script>
import config from '@config'
import { MenuTypes } from '../../constant'
import { inIframe, isPhone } from '../../utils'
import SmySiteCell from '../../components/cell'
import SmySiteIcon from '../../components/icon'
import ArrowRight from '@smy-h5/icons/dist/es/ArrowRight'

export default {
  name: 'AppHome',
  components: { SmySiteCell, ArrowRight, SmySiteIcon },
  data: () => ({
    platform: 'mobile',
  }),
  computed: {
    components: () => (config?.pc?.menu ?? []).filter((item) => item.type === MenuTypes.COMPONENT),
  },
  methods: {
    toComponent(component) {
      this.$router.push({
        path: `/${component.doc}`,
        query: {
          platform: this.platform,
          replace: component.doc,
        },
      })

      if (!isPhone() && inIframe()) {
        window.top?.scrollToMenu(component.doc)
      }
    },
  },
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
</style>
