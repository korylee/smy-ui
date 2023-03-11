<template>
  <div class="loading-example">
    <div>类型</div>
    <div class="loading-demo__type-block">
      <smy-loading type="circle" size="20" color="#555" />
      <smy-loading type="cube" />
      <smy-loading type="wave" />
      <smy-loading type="disappear" />
    </div>
    <div>
      <div>包裹</div>
      <button @click="loading = !loading">开关loading</button>
      <smy-loading desc="loading..." :loading="loading" color="#c8c9cc" size="30">
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
