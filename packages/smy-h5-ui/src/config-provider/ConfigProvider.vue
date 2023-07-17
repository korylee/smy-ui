<template>
  <component :is="tag" class="smy-config-provider" :style="formatStyleVars(styleVars)">
    <slot />
  </component>
</template>

<script>
import { props } from './props'
import { formatStyleVars } from '../_utils/style'
import { createNamespace } from '../_utils/vue/create'

const [name] = createNamespace('config-provider')

export default {
  name,
  props,
  methods: {
    formatStyleVars,
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
</style>
