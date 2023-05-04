<template>
  <div>
    <smy-progress-circular value="20" />
    <smy-progress-circular indeterminate value="20" />
    <smy-progress-circular indeterminate="disable-shrink" value="20" />
  </div>
</template>
<script>
import SmyProgressCircular from '..'

export default {
  name: 'ProgressCircularExample',
  components: { SmyProgressCircular },
}
</script>
