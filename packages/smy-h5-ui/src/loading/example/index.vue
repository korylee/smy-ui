<template>
  <div>
    <div>类型</div>
    <div class="loading-demo__type-block">
      <smy-loading type="circle" />
      <smy-loading type="cube" />
      <smy-loading type="wave" />
      <smy-loading type="disappear" />
    </div>
    <div>
      <div>包裹</div>
      <button @click="loading = !loading">开关loading</button>
      <smy-loading description="loading..." :loading="loading">
        <smy-card title="介绍" content="北极星的眼泪，哒哒哒哒哒哒" />
      </smy-loading>
    </div>
  </div>
</template>
<script>
import SmyLoading from '..'
import SmyCard from '../../card'

export default {
  name: 'LoadingExample',
  components: { SmyLoading, SmyCard },
  data: () => ({ loading: false }),
}
</script>
