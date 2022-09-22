<template>
  <div>
    loading
    <div></div>
    <div class="loading-demo__type-block">
      <smy-loading type="circle" />
      <smy-loading type="cube" />
      <smy-loading type="wave" />
      <smy-loading type="rect" />
    </div>
  </div>
</template>
<script>
import SmyLoading from '..'

export default {
  name: 'LoadingExample',
  components: { SmyLoading },
}
</script>
