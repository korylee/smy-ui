<template>
  <div class="smy-site-mobile">
    <div class="smy-site-mobile-content">
      <iframe id="mobile" :src="iframeSrc"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppMobile',
  props: {
    componentName: String,
    replace: String,
  },
  computed: {
    iframeSrc({ componentName, replace }) {
      return `./mobile.html#/${componentName}?platform=pc&replace=${replace}`
    },
  },
}
</script>

<style lang="less">
iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: none;
}

.smy-site-mobile {
  position: sticky;
  flex: 0 0 375px;
  top: 80px;
  height: calc(100vh - 200px);
  min-height: 667px;
  margin-right: 38px;
  overflow: hidden;
  border-radius: 2px;
  box-shadow: 0 0 14px 6px var(--site-config-color-shadow);

  &-content {
    width: 100%;
    height: 100%;
  }
}
</style>
