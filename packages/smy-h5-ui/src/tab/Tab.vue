<template>
  <smy-swiper-item
    v-if="tabs.animated || tabs.swipeable"
    :class="bem('panel-wrapper')"
    :tabindex="active ? 0 : -1"
    role="tabpanel"
  >
    <div :class="bem('panel')"><slot /></div>
  </smy-swiper-item>
  <div v-else v-show="tabs.scrollspy || active" :class="bem('panel')" role="tabpanel">
    <slot v-if="inited || tabs.scrollspy" />
  </div>
</template>
<script>
import { createChildrenMixin } from '../_mixins/relation'
import { SlotsMixin } from '../_mixins/slots'
import TabTitle from './TabTitle.vue'
import { assign, pick } from '../_utils/shared'
import { props } from './props'
import SmySwiperItem from '../swiper-item'
import { name, bem } from './utils'

export default {
  name,
  props,
  mixins: [createChildrenMixin('tabs'), SlotsMixin],
  components: { SmySwiperItem },
  data: () => ({
    inited: false,
  }),
  computed: {
    active({ name, index, tabs }) {
      const isActive = (name || index) === tabs.currentName
      if (isActive && !this.inited) {
        this.init()
      }
      return isActive
    },
  },
  watch: {
    title() {
      const { tabs } = this
      tabs.setLine()
      tabs.scrollIntoView()
    },
  },
  methods: {
    bem,
    renderTitle({ data, listeners }) {
      const { getSlot, $createElement: h, $props, active } = this
      const attrs = assign({ role: 'tab', active }, data.attrs, pick($props, ['badge', 'title', 'disabled']))
      const mergedData = {
        on: listeners,
        attrs,
        ref: 'tab-title',
      }
      return h(TabTitle, mergedData, [getSlot('title')])
    },
    init() {
      this.inited = true
      const { tabs, name, index } = this
      if (tabs.lazyRender) {
        tabs.$emit('rendered', name || index)
      }
    },
  },
}
</script>
