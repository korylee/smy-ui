<template>
  <div class="vert-panel">
    <Scroller
      :is-loading="isLoading"
      :is-un-more="isUnMore"
      :propsTime="0"
      @pulldown="pulldown"
      @scrollChange="scrollChange"
      @loadMore="loadMoreVert"
    >
      <div class="smy-vert-list-panel">
        <div class="smy-vert-list-item" v-for="(item, index) of listData" :key="index">
          <dl class="smy-scroller-item-info">
            <dt>{{ index }} 防水升级版 蓝牙音箱 低音炮 IPX7设计 户外便携音响 迷你小音</dt>
            <dd>2018-02-25</dd>
          </dl>
        </div>
      </div>
    </Scroller>
  </div>
</template>

<script>
import Scroller from '../Scroller.jsx'

export default {
  name: 'ScrollExample',
  components: { Scroller },
  data: () => ({
    listData: new Array(10),
    isLoading: false,
    isUnMore: false,
    maxPages: 4,
    page: 2,
  }),
  methods: {
    pulldown() {
      console.log('pulldown')
      this.isLoading = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.isLoading = false
        this.isUnMore = false
        this.listData = new Array(20)
        this.page = 2
      }, 3000)
    },
    loadMoreVert() {
      this.isLoading = true
      if (this.page > this.maxPage) {
        this.isUnMore = true
        this.isLoading = false
      } else {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.isLoading = false
          this.isUnMore = false
          this.listData.push(...new Array(20))
          this.page++
        }, 66000)
      }
    },
    scrollChange(e) {
      console.log(e)
    },
  },
}
</script>

<style lang="less" scoped>
.vert-panel {
  height: 400px;
  padding: 10px;
  background-color: #e1e1e1;
}

.smy-scroller-item-info {
  flex: 1;
  padding-left: 10px;
  line-height: 20px;
  margin: 0;
  dt {
    font-size: 14px;
  }
  dd {
    margin-left: 0;
    font-size: 12px;
  }
}

.smy-vert-list-panel {
  .smy-vert-list-item {
    display: flex;
    height: 60px;
    padding: 10px;
    margin-bottom: 10px;
    background-color: #fff;
    color: #000;
  }
}
</style>
