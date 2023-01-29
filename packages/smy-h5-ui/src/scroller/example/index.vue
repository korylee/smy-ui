<template>
  <div>
    <ul class="scroller">
      <smy-scroller
        v-model="infinityValue"
        :has-more="hasMore"
        load-text="Loading..."
        load-more-text="没有了哦~"
        @load-more="loadMore"
      >
        <li class="scroller-item" v-for="(item, index) of list" :key="index">{{ index }}</li>
      </smy-scroller>
    </ul>
  </div>
</template>

<script>
import SmyScroller from '../'
// import SmyCell from '../../cell'

export default {
  name: 'ScrollerExample',
  components: { SmyScroller },
  data: () => ({
    list: Array.from({ length: 20 }),
    cycle: 0,
    infinityValue: false,
    hasMore: true,
  }),
  methods: {
    loadMore() {
      setTimeout(() => {
        this.list.push(...Array.from({ length: 5 }))
        this.cycle++
        if (this.cycle > 2) this.hasMore = false
        this.infinityValue = false
      }, 80000)
    },
  },
}
</script>

<style lang="less" scoped>
.scroller {
  width: 100%;
  height: calc(100vh - 120px);
  padding: 0;
  margin: 0;
  overflow-y: auto;
  overflow-x: hidden;
  &-item {
    font-size: 14px;
    color: #333;
    padding: 12px 0;
    border-bottom: 1px solid #eee;
  }
}
</style>
