<template>
  <div class="smy-vert-scroll" ref="wrapper" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
    <div class="smy-vert-list" ref="list" :style="{ 'min-height': listMinHeightStyle }">
      <div v-if="isFirstPull" class="smy-vert-pulldown">
        <div v-if="!isLoading" class="smy-vert-pulldown-txt">{{ pulldownTxt }}</div>
        <div v-else class="smy-vert-pulldown-status">
          <Loading :size="loadingSize" :type="loadingType" class="smy-vert-loading" />
          <span class="smy-vert-loading-txt">{{ loadingTxt }}</span>
        </div>
      </div>
      <slot />
      <div class="smy-vert-loadmore">
        <template v-if="!isUnMore && isShowLoadMore">
          <div v-if="isLoading" class="smy-vert-load-status">
            <Loading :size="loadingSize" :type="loadingType" class="smy-vert-loading" />
            <span class="smy-vert-loading-txt">{{ loadingTxt }}</span>
          </div>
        </template>
        <template v-else-if="isUnMore">
          <div class="smy-vert-unloadmore-txt">{{ unloadMoreTxt }}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { upperFirst } from '../_utils/shared'
import { vertProps } from './props'
import Loading from '../loading'

function setStyle(style, key, value) {
  style[key] = value
  style[`webkit${upperFirst(key)}`] = value
}

export default {
  name: 'SmyVertScroll',
  props: vertProps,
  components: { Loading },
  data: () => ({
    touchParams: {
      startY: 0,
      endY: 0,
      startTime: 0,
      endTime: 0,
    },
    translateY: 0,
    scrollDistance: 0,
    timer: null,
    timerEmit: null,
    realMove: 0,
    isShowLoadMore: false,
    listMinHeightStyle: 'auto',
    isFirstPull: true,
  }),
  watch: {
    isLoading(status) {
      if (!status && this.realMove === 0) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.setTransform(this.realMove, 'end', null)
        }, this.propsTime)
      }
    },
    isUnMore: {
      immediate: true,
      async handler() {
        await this.$nextTick()
        this.isShow()
      },
    },
    scrollTo(val) {
      if (typeof val !== 'number' || isNaN(val) || val > 0) return
      this.setTransform(val, null, 500)
      this.$emit('scrollToCb')
    },
  },
  mounted() {
    this.$once('hook:beforeDestroy', () => {
      clearTimeout(this.timer)
      clearTimeout(this.timerEmit)
    })
  },
  methods: {
    isShow() {
      const { wrapper, list } = this.$refs
      const wrapH = wrapper?.offsetHeight
      const listH = list?.offsetHeight
      if (wrapH < listH) {
        this.isShowLoadMore = true
        this.listMinHeightStyle = 'auto'
      } else {
        this.isShowLoadMore = false
        this.isFirstPull = true
        this.listMinHeightStyle = `${wrapH}px`
      }
    },
    setTransform(translateY = 0, type, time = 500) {
      const { list } = this.$refs
      if (!list) return
      const transition = type === 'end' ? `transform ${time}ms cubic-bezier(0.19, 1, 0.22, 1)` : ''
      setStyle(list.style, 'transition', transition)
      setStyle(list.style, 'transform', `translate3d(0, ${translateY}px, 0)`)
      this.scrollDistance = translateY
      this.$emit('scrollChange', translateY)
    },
    setMove(move, type, time) {
      const { wrapper, list } = this.$refs
      const { stretch } = this
      let updateMove = move + this.translateY
      const h = wrapper.offsetHeight
      const maxMove = -list.offsetHeight + h
      if (type === 'end') {
        if (updateMove > 0) {
          this.realMove = 0
          if ((!this.isShowLoadMore || this.isFirstPull) && !this.isLoading && updateMove > stretch) {
            updateMove = 50
            clearTimeout(this.timerEmit)
            this.timerEmit = setTimeout(() => {
              this.$emit('pulldown')
            }, time / 2)
          } else {
            this.isFirstPull = true
            updateMove = 0
          }
        } else if (updateMove < 0 && updateMove < maxMove + this.threshold) {
          if (updateMove < maxMove) {
            updateMove = maxMove
          }
          this.realMove = maxMove
          if (!this.isLoading && !this.isUnMore) {
            this.$emit('loadMore')
            this.$emit('pullup')
          }
        }
        this.setTransform(updateMove, type, time)
      } else {
        if (updateMove > 0 && updateMove > stretch) {
          updateMove = stretch
        } else if (updateMove < maxMove - stretch) {
          updateMove = maxMove - stretch
        }
        this.setTransform(updateMove, null, null)
      }
    },
    onTouchStart(event) {
      const changedTouch = event.changedTouches[0]

      this.touchParams.startY = changedTouch.pageY
      this.touchParams.startTime = event.timestamp || Date.now()
      this.translateY = this.scrollDistance
    },
    onTouchMove(event) {
      event.preventDefault()
      const changedTouch = event.changedTouches[0]
      const { touchParams } = this
      touchParams.lastY = changedTouch.pageY
      touchParams.lastTime = event.timestamp || Date.now()
      const move = touchParams.lastY - touchParams.startY
      if (move < 0 && this.isShowLoadMore && this.isFirstPull) {
        this.isFirstPull = false
      }
      this.setMove(move)
    },
    onTouchEnd(event) {
      const { wrapper, list } = this.$refs
      const { touchParams } = this
      const changedTouch = event.changedTouches[0]
      touchParams.lastY = changedTouch.pageY
      let move = touchParams.lastY - touchParams.startY
      let moveTime = touchParams.lastTime - touchParams.startTime
      const h = wrapper.offsetHeight
      const maxMove = -list.offsetHeight + h
      if (moveTime <= 300) {
        move = move * 2
        if (move < 0 && move < maxMove) {
          move = maxMove
        }
        moveTime = moveTime + 500
        this.setMove(move, 'end', moveTime)
      } else {
        this.setMove(move, 'end')
      }
    },
  },
}
</script>
