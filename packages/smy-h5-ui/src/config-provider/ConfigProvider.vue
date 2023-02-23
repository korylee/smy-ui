<template>
  <component :is="tag" class="smy-config-provider" :style="formatStyleVars(styleVars)">
    <slot />
  </component>
</template>

<script>
import { props } from './props'
import { formatStyleVars } from '../_utils/style'

export default {
  name: 'SmyConfigProvider',
  props,
  methods: {
    formatStyleVars,
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
</style>
