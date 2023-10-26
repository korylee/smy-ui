<template>
  <component :is="tag" :class="bem()" :style="formatStyleVars(styleVars)">
    <slot />
  </component>
</template>

<script>
import { props } from './props'
import { formatStyleVars } from '../_utils/style'
import { createNamespace } from '../_utils/vue/create'

const [name, bem] = createNamespace('config-provider')

export default {
  name,
  props,
  methods: {
    formatStyleVars,
    bem,
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
</style>
