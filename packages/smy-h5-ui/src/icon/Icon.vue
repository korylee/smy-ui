<template>
  <component :is="!$slots.default && name ? 'i' : tag" :class="classes" :style="style">
    <slot> <img v-if="isImageIcon" class="smy-icon__image" :src="name" /></slot>
  </component>
</template>

<script>
import { convertToUnit, requestAnimationFrame } from '../_utils/dom'
import { props } from './props'
import { toNumber } from '../_utils/shared'
import { createNamespace } from '../_utils/vue/create'

const isImage = (name) => name?.includes('/')

const [name, bem] = createNamespace('icon')

export default {
  name,
  props,
  data: () => ({
    shrinking: false,
    nextName: '',
  }),
  computed: {
    isImageIcon({ nextName }) {
      return isImage(nextName)
    },
    style() {
      const { transition, size, color } = this
      return {
        color,
        fontSize: convertToUnit(size),
        transition: `transform ${toNumber(transition)}ms`,
      }
    },
    classes({ nextName, namespace, isImageIcon, shrinking }) {
      return {
        [bem({ shrinking })]: true,
        [`${namespace}--set ${namespace}-${nextName}`]: namespace && nextName && !isImageIcon,
      }
    },
  },
  watch: {
    name: {
      immediate: true,
      handler(newName, oldName) {
        if (oldName == null || toNumber(this.transition) === 0) {
          this.nextName = newName
          return
        }

        this.shrinking = true
        setTimeout(() => {
          requestAnimationFrame(() => {
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
