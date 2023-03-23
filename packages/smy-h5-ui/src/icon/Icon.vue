<template>
  <component :is="!hasSlot() && name ? 'i' : tag" :class="classes" :style="style" v-on="$listeners">
    <slot />
  </component>
</template>

<script>
import { createGetMergedProp, InjectionKey } from '../config-provider/config'
import { convertToUnit, requestAnimationFrame } from '../_utils/dom'
import { props } from './props'
import { SlotsMixin } from '../_utils/vue/slots'
import { toNumber } from '../_utils/shared'

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
    style() {
      const { transition } = this
      const size = getMergedProp(this, 'size')
      return {
        color: getMergedProp(this, 'color'),
        fontSize: convertToUnit(size),
        transition: `transform ${toNumber(transition)}ms`,
      }
    },
    classes({ nextName, namespace }) {
      return {
        'smy-icon': true,
        'smy-icon--shrinking': this.shrinking,
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
