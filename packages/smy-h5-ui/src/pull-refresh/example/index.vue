<template>
  <div>
    <smy-pull-refresh v-model="refresh" @refresh="onRefresh">
      <div class="pull-block">下拉刷新</div>
    </smy-pull-refresh>
  </div>
</template>
<script>
import SmyPullRefresh from '../'
import toast from '../../toast'

export default {
  name: 'PullRefreshExample',
  components: { SmyPullRefresh },
  data: () => ({
    refresh: false,
  }),
  methods: {
    onRefresh() {
      setTimeout(() => {
        this.refresh = false
        toast('刷新成功！')
      }, 2000)
    },
  },
}
</script>
<style lang="less" scoped>
.pull-block {
  text-align: center;
  color: #999;
  font-size: 16px;
  padding-top: 60px;
}

.smy-pull-refresh {
  height: calc(100vh - 110px);
}
</style>
