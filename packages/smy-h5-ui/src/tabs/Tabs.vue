<template>
  <div ref="root" v-intersect="setLine" :class="bem()">
    <maybe-sticky ref="sticky" :maybe="sticky" :container="$refs.root" @scroll="$emit('scroll', $event)">
      <div ref="wrap" :class="bem('wrap')">
        <div
          ref="nav"
          :class="bem('nav', { line: true, shrink, scrollable })"
          :style="navStyle"
          role="tablist"
          aria-orientation="horizontal"
        >
          <slot name="nav-left"></slot>
          <tab-title
            v-for="(item, index) of children"
            :key="item._uid"
            :tab="item"
            :shrink="shrink"
            :scrollable="scrollable"
            @click="onClickTab(item, index, $event)"
          />
          <div v-if="children.length" :class="bem('line')" :style="lineStyle"></div>
          <slot name="nav-right"></slot>
        </div>
      </div>
      <slot name="nav-bottom"></slot>
    </maybe-sticky>
    <tabs-content
      ref="content"
      :count="children.length"
      :animated="animated"
      :swipeable="swipeable"
      :duration="duration"
      :inited="inited"
      :current-index="currentIndex"
      @change="setCurrentIndex"
    >
      <slot />
    </tabs-content>
  </div>
</template>

<script>
import { ListenersMixin } from '../_mixins/listeners'
import { createParentMixin } from '../_mixins/relation'
import { useWindowSize } from '../_utils/composable/useWindowSize'
import {
  convertToUnit,
  doubleRaf,
  getElementTop,
  getParentScroller,
  getRect,
  setRootScrollTop,
  toPxNum,
} from '../_utils/dom'
import { isNil } from '../_utils/is'
import { createMaybeComponent } from '../_utils/vue/component'
import { createNamespace } from '../_utils/vue/create'
import SmySticky from '../sticky'
import { scrollLeftTo, scrollTopTo } from './utils'
import Intersect from '../intersect'
import TabsContent from './TabsContent.vue'
import { props } from './props'
import { onMountedOrActivated } from '../_utils/vue/lifetime'

const [name, bem] = createNamespace('tabs')

const MaybeSticky = createMaybeComponent(SmySticky)

const TabTitle = {
  functional: true,
  props: { tab: Object },
  render(h, context) {
    const { props } = context
    return props.tab?.renderTitle(context)
  },
}

const getTabName = (tab, index) => tab.name ?? index

export default {
  name,
  components: { MaybeSticky, TabTitle, TabsContent },
  props,
  directives: { Intersect },
  mixins: [createParentMixin('tabs'), ListenersMixin],
  data: () => ({
    inited: false,
    currentIndex: -1,
    tabHeight: 0,
    windowSize: useWindowSize(),
    lineStyle: {},
  }),
  computed: {
    scrollable({ ellipsis, shrink, children, scrollThreshold }) {
      return children.length > +scrollThreshold || !ellipsis || shrink
    },
    currentName({ children, currentIndex }) {
      const activeTab = children[currentIndex]
      if (!activeTab) return
      return getTabName(activeTab, currentIndex)
    },
    navStyle({ color, background }) {
      return { borderColor: color, background }
    },
    offsetTopPx({ offsetTop }) {
      return toPxNum(offsetTop)
    },
    scrollOffset({ sticky, tabHeight, offsetTopPx }) {
      if (sticky) {
        return tabHeight + offsetTopPx
      }
      return 0
    },
  },
  watch: {
    active(value) {
      if (value === this.currentName) return
      this.setCurrentIndexByName(value)
    },
    children() {
      if (!this.inited) return
      this.setCurrentIndexByName(this.active)
      this.setLine()
      this.$nextTick(() => {
        this.scrollIntoView(true)
      })
    },
    'windowSize.width': 'resize',
  },
  created() {
    onMountedOrActivated(this, this.init)

    const add = () => {
      doubleRaf(() => {
        this.scroller = getParentScroller(this.$refs.root)
        this.scroller.addEventListener('scroll', this.onScroll, { passive: true })
      })
    }
    const remove = () => {
      this.scroller && this.scroller.removeEventListener('scroll', this.onScroll)
    }
    onMountedOrActivated(this, add)
    this.$on(['hook:beforeDestory', 'hook:deactivated'], remove)
  },
  methods: {
    bem,
    onScroll() {
      if (!this.scrollspy || this.lockScroll) {
        return
      }
      const index = this.getCurrentIndexOnScroll()
      this.setCurrentIndex(index)
    },
    scrollTo(name) {
      this.$nextTick(() => {
        this.setCurrentIndexByName(name)
        this.scrollToCurrentContent(true)
      })
    },
    onClickTab(item, index, event) {
      const { title, disabled } = item
      const { getListener } = this
      const onBeforeChange = getListener('before-change')
      const onClickTab = getListener('click-tab')
      const name = getTabName(item, index)
      if (!disabled) {
        Promise.resolve(onBeforeChange ? onBeforeChange(name) : true).then(() => {
          this.setCurrentIndex(index)
          this.scrollToCurrentContent()
        })
      }
      onClickTab?.({ name, title, event, disabled })
    },
    findAvailableTabIndex(index) {
      const diff = index < this.currentIndex ? -1 : 1
      const { children } = this
      while (index >= 0 && index < children.length) {
        if (!children[index].disabled) {
          return index
        }
        index += diff
      }
    },
    scrollIntoView(immediate) {
      const { nav } = this.$refs
      const { currentIndex, scrollable, children } = this
      const item = children[currentIndex]

      if (!scrollable || !nav || !children.length || !item) {
        return
      }
      const title = item.$refs['tab-title']?.$el
      if (!title) {
        return
      }
      const to = title.offsetLeft - (nav.offsetWidth - title.offsetWidth) / 2
      if (this.cancelScrollLeftToRaf) this.cancelScrollLeftToRaf()
      this.cancelScrollLeftToRaf = scrollLeftTo(nav, to, immediate ? 0 : +this.duration)
    },
    setCurrentIndex(currentIndex, skipScrollIntoView) {
      const newIndex = this.findAvailableTabIndex(currentIndex)
      if (isNil(newIndex)) {
        return
      }
      const newTab = this.children[newIndex]
      const newName = getTabName(newTab, newIndex)
      const shouldEmitChange = this.currentIndex !== null
      if (this.currentIndex !== newIndex) {
        this.currentIndex = newIndex
        if (!skipScrollIntoView) {
          this.scrollIntoView()
        }
        this.setLine()
      }
      if (newName !== this.active) {
        this.$emit('update:active', newName)
        if (shouldEmitChange) {
          this.$emit('change', newName, newTab.title)
        }
      }

      const { root, sticky } = this.$refs
      if (sticky?.fixed && !this.scrollspy) {
        setRootScrollTop(Math.ceil(getElementTop(root) - this.offsetTopPx))
      }
    },
    setCurrentIndexByName(name, skipScrollIntoView = false) {
      const { children } = this
      const matchedIndex = children.findIndex((tab, index) => getTabName(tab, index) === name)
      const index = matchedIndex === -1 ? 0 : matchedIndex
      this.setCurrentIndex(index, skipScrollIntoView)
    },
    scrollToCurrentContent(immediate = false) {
      if (!this.scrollspy) return
      const { children, currentIndex, scrollOffset, scroller } = this
      const item = children[currentIndex]
      const target = item?.$el
      if (!target || !scroller) return
      const to = getElementTop(target, scroller) - scrollOffset
      this.lockScroll = true
      if (this.cancelScrollTopToRaf) this.cancelScrollTopToRaf()
      this.cancelScrollTopToRaf = scrollTopTo(scroller, to, immediate ? 0 : +this.duration, () => {
        this.lockScroll = false
      })
    },
    setLine() {
      const shouldAnimate = this.inited
      this.$nextTick(() => {
        const { children, currentIndex, lineWidth, lineHeight, color, duration } = this
        const item = children[currentIndex]
        const title = item?.$refs['tab-title']?.$el
        if (!title) {
          this.lineStyle = {
            display: 'none',
          }
          return
        }
        const left = title.offsetLeft + title.offsetWidth / 2
        let height
        let borderRadius
        if (!isNil(lineHeight)) {
          height = convertToUnit(lineHeight)
          borderRadius = height
        }
        this.lineStyle = {
          width: convertToUnit(lineWidth),
          backgroundColor: color,
          transform: `translateX(${left}px) translateX(-50%)`,
          transitionDuration: shouldAnimate ? `${duration}ms` : undefined,
          borderRadius,
          height,
        }
      })
    },
    getCurrentIndexOnScroll() {
      const { children, scrollOffset } = this
      for (let index = 0; index < children.length; index++) {
        const { top } = getRect(children[index]?.$el)
        if (top > scrollOffset) {
          return !index ? 0 : index - 1
        }
      }
      return children.length - 1
    },
    resize() {
      this.setLine()
      this.$nextTick(() => {
        this.scrollIntoView(true)
        this.$refs.content?.$refs.swipe?.resize()
      })
    },
    init() {
      this.setCurrentIndexByName(this.active, true)
      this.$nextTick(() => {
        this.inited = true
        const { wrap } = this.$refs
        this.tabHeight = getRect(wrap).height

        this.scrollIntoView(true)
      })
    },
  },
}
</script>

<style lang="less">
@import '../sticky/sticky.less';
@import './tabs.less';
</style>
