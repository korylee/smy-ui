<template>
  <div class="smy-doc-index">
    <div class="smy-doc-index__layout">
      <div class="smy-doc-index__logo-container">
        <div class="smy-doc-index__logo-background-mask"></div>
      </div>
      <div class="smy-doc-index__title">{{ title }}</div>
      <div v-if="indexPage.description" class="smy-doc-index__description">{{ indexPage.description }}</div>
      <div class="smy-doc-index__link-button-group">
        <smy-site-button type="primary" style="line-height: 1.2" class="smy-doc-index__link-button" @click="getStart">
          <span class="smy-doc-index__link-button-text">{{ indexPage.started || '起步' }}</span>
        </smy-site-button>
      </div>
      <div v-if="indexPage.features" class="smy-doc-index__features">
        <div v-for="(feature, index) of indexPage.features" :key="index" class="smy-doc-index__feature">
          <div class="smy-doc-index__feature-name">{{ feature.name }}</div>
          <div class="smy-doc-index__feature-name">{{ feature.description }}</div>
        </div>
      </div>
      <div class="smy-doc-index__footer">
      </div>
    </div>
  </div>
</template>

<script>
import config from '@config'

export default {
  data: () => ({
    title: config?.title,
    indexPage: config?.pc?.indexPage ?? {},
  }),
  methods: {
    getStart () {
      this.$router.push('/home')
    },
  },
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
