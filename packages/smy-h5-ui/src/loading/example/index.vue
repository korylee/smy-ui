<template>
  <div class="loading-example">
    <app-demo-title>类型</app-demo-title>
    <div class="loading-demo__type-block">
      <smy-loading type="circle" size="20" color="#555" />
      <smy-loading type="cube" />
      <smy-loading type="wave" />
    </div>
    <div>
      <app-demo-title>包裹</app-demo-title>
      <button @click="loading = !loading">开关loading</button>
      <smy-loading desc="loading..." :loading="loading" size="20">
        <smy-cell title="介绍" desc="北极星的眼泪，哒哒哒哒哒哒" />
      </smy-loading>
    </div>
  </div>
</template>
<script>
import SmyLoading from '..'
import SmyCell from '../../cell'
import { AppDemoTitle } from '@smy-h5/cli/client'

export default {
  name: 'LoadingExample',
  components: { SmyLoading, SmyCell, AppDemoTitle },
  data: () => ({ loading: false }),
}
</script>
