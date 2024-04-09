import { getListener } from '../_mixins/listeners'
import { createParentMixin } from '../_mixins/relation'
import { useWindowSize } from '../_utils/composable/useWindowSize'
import {
  isNil,
  convertToUnit,
  doubleRaf,
  getElementTop,
  getParentScroller,
  getRect,
  setRootScrollTop,
  toPxNum,
} from '@smy-h5/shared'
import { createNamespace } from '../_utils/vue/create'
import SmySticky from '../sticky'
import SmySwiper from '../swiper'
import { scrollLeftTo, scrollTopTo } from './utils'
import Intersect from '../intersect'
import { props } from './props'
import { onMountedOrActivated } from '../_utils/vue/lifetime'
import { PopupMixin } from '../popup/provide'
import { TABS_KEY } from './shared'

import '../sticky/sticky.less'
import './tabs.less'

const [name, bem] = createNamespace('tabs')

const getTabName = (tab, index) => tab.name ?? index

export default {
  name,
  props,
  directives: { Intersect },
  mixins: [createParentMixin(TABS_KEY), PopupMixin],
  data: () => ({
    inited: false,
    currentIndex: -1,
    tabHeight: 0,
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
  },
  created() {
    const vm = this
    onMountedOrActivated(vm, vm.init)
    const windowSize = useWindowSize()
    this.$watch(() => windowSize.width, vm.resize)

    const add = () => {
      window.addEventListener('pageshow', vm.resize)
      doubleRaf(() => {
        vm.scroller = getParentScroller(vm.$refs.root)
        vm.scroller.addEventListener('scroll', vm.onScroll, { passive: true })
      })
    }
    const remove = () => {
      vm.scroller && vm.scroller.removeEventListener('scroll', vm.onScroll)
      window.removeEventListener('pageshow', vm.resize)
    }
    onMountedOrActivated(vm, add)
    vm.$on(['hook:beforeDestory', 'hook:deactivated'], remove)
    vm.popupProvider?.$on('show', vm.setLine)
  },
  methods: {
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
      const onBeforeChange = getListener.call(this, 'before-change')
      const onClickTab = getListener.call(this, 'click-tab')
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
        const { swiper } = this.$refs
        if (swiper?.to && swiper.active !== newIndex) {
          swiper.to?.(newIndex)
        }
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
        const title = item.$refs['tab-title']?.$el
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
        this.$refs.content?.$refs.swiper?.resize()
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
  render() {
    const vm = this
    const _c = vm.$createElement
    const renderTitle = () => {
      const { children: tabs, shrink, scrollable } = vm
      const children = [
        <div ref="wrap" class={bem('wrap')}>
          <div
            ref="nav"
            class={bem('nav', { line: true, shrink, scrollable })}
            style={vm.navStyle}
            role="tablist"
            aria-orientation="horizontal"
          >
            {vm._t('nav-left')}
            {vm._l(tabs, (tab, index) =>
              tab.renderTitle?.({
                attrs: {
                  scrollable,
                  shrink,
                },
                listeners: { click: ($event) => vm.onClickTab(tab, index, $event) },
              }),
            )}
            {tabs.length ? <div class={bem('line')} style={vm.lineStyle}></div> : null}
            {vm._t('nav-right')}
          </div>
        </div>,
        vm._t('nav-bottom'),
      ]
      return vm.sticky
        ? _c(SmySticky, { ref: 'sticky', on: { scroll: (event) => vm.$emit('scroll', event) } }, children)
        : children
    }
    const renderContent = () => {
      const { swipeable, animated: _animated } = vm
      const animated = _animated || swipeable
      const { duration } = vm
      const children = vm._t('default')
      return (
        <div class={bem('content', { animated })}>
          {animated
            ? _c(
                SmySwiper,
                {
                  ref: 'swiper',
                  attrs: { loop: false, indicators: false, duration, touchable: swipeable },
                  on: { change: (activeIndex) => vm.setCurrentIndex(activeIndex) },
                  class: bem('track'),
                },
                children,
              )
            : children}
        </div>
      )
    }

    return (
      <div ref="root" v-intersect={vm.setLine} class={bem()}>
        {renderTitle()}
        {renderContent()}
      </div>
    )
  },
}
