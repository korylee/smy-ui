<template>
  <component :is="!hasSlot() && name ? 'i' : tag" :class="classes" :style="style" v-on="$listeners">
    <slot> <img v-if="isImageIcon" class="smy-icon__image" :src="name" /></slot>
  </component>
</template>

<script>
import { createGetMergedProp, InjectionKey } from '../config-provider/config'
import { convertToUnit, requestAnimationFrame } from '../_utils/dom'
import { props } from './props'
import { SlotsMixin } from '../_utils/vue/slots'
import { toNumber } from '../_utils/shared'

const isImage = (name) => name?.includes('/')

const getMergedProp = createGetMergedProp('icon')

export default {
  name: 'SmyIcon',
  props,
  mixins: [SlotsMixin],
  inject: {
    [InjectionKey]: {
      default: null,
    },
  },
  data: () => ({
    shrinking: false,
    nextName: '',
  }),
  computed: {
    isImageIcon({ nextName }) {
      return isImage(nextName)
    },
    style() {
      const { transition } = this
      const size = getMergedProp(this, 'size')
      return {
        color: getMergedProp(this, 'color'),
        fontSize: convertToUnit(size),
        transition: `transform ${toNumber(transition)}ms`,
      }
    },
    classes({ nextName, namespace, isImageIcon }) {
      return {
        'smy-icon': true,
        'smy-icon--shrinking': this.shrinking,
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
