<template>
  <component :is="!$slots.default && name ? 'i' : tag" :class="classes" :style="style" v-on="$listeners">
    <slot />
  </component>
</template>

<script>
import { convertToUnit, raf, toNumber } from '@smy-h5/shared'
import { props } from './props'

export default {
  name: 'SmySiteIcon',
  props,
  data: () => ({
    shrinking: false,
    nextName: '',
  }),
  computed: {
    style({ transition, size, color }) {
      return {
        color,
        fontSize: convertToUnit(size),
        transition: `transform ${toNumber(transition)}ms`,
      }
    },
    classes({ nextName, namespace }) {
      return {
        'smy-site-icon': true,
        'smy-site-icon--shrinking': this.shrinking,
        [`${namespace}--set ${namespace}-${nextName}`]: namespace && nextName,
      }
    },
  },
  watch: {
    name: {
      immediate: true,
      async handler(newName, oldName) {
        if (oldName == null || toNumber(this.transition) === 0) {
          this.nextName = newName
          return
        }

        this.shrinking = true
        await this.$nextTick()
        setTimeout(() => {
          raf(() => {
            oldName != null && (this.nextName = newName)
            this.shrinking = false
          })
        }, toNumber(this.transition))
      },
    },
  },
}
</script>

<style lang="less">
@import './icon.less';
</style>
