<template>
  <smy-swiper-item
    v-if="tabs.animated || tabs.swipeable"
    :class="bem('panel-wrapper')"
    :tabindex="active ? 0 : -1"
    role="tabpanel"
  >
    <div :class="bem('panel')">
      <slot />
    </div>
  </smy-swiper-item>
  <div v-else v-show="tabs.scrollspy || active" :class="bem('panel')" role="tabpanel">
    <slot v-if="inited || tabs.scrollspy" />
  </div>
</template>
<script>
import { createChildrenMixin } from '../_mixins/relation'
import TabTitle from './TabTitle.vue'
import { assign, pick } from '@smy-h5/shared'
import { props } from './props'
import SmySwiperItem from '../swiper-item'
import { name, bem } from './utils'
import { TABS_KEY } from '../tabs/shared'

export default {
  name,
  props,
  mixins: [createChildrenMixin(TABS_KEY)],
  components: { SmySwiperItem },
  data: () => ({
    inited: false,
  }),
  computed: {
    active({ name, index, [TABS_KEY]: parent }) {
      const isActive = (name || index) === parent.currentName
      if (isActive && !this.inited) {
        this.init()
      }
      return isActive
    },
  },
  watch: {
    title() {
      const { [TABS_KEY]: parent } = this
      parent.setLine()
      parent.scrollIntoView()
    },
  },
  methods: {
    bem,
    renderTitle({ attrs: _attrs, listeners }) {
      const vm = this
      const { $createElement: h, $props, active, titleClass, titleStyle } = vm
      const attrs = assign(
        {
          role: 'tab',
          active,
        },
        _attrs,
        pick($props, ['badge', 'title', 'disabled']),
      )
      const mergedData = {
        on: listeners,
        attrs,
        class: titleClass,
        style: titleStyle,
        ref: 'tab-title',
      }
      return h(TabTitle, mergedData, [vm._t('title')])
    },
    init() {
      this.inited = true
      const { [TABS_KEY]: parent, name, index } = this
      if (parent.lazyRender) {
        parent.$emit('rendered', name || index)
      }
    },
  },
}
</script>
