<template>
  <div>
    <smy-progress-circular value="20" />
    <smy-progress-circular value="20" color="#f38181" bg-color="#fce38a" />
    <smy-progress-circular indeterminate value="20" />
    <smy-progress-circular indeterminate="disable-shrink" value="20" />
    <smy-progress-circular value="20" size="40">
      <template #default="{ value }">{{ value }}</template>
    </smy-progress-circular>
  </div>
</template>
<script>
import SmyProgressCircular from '..'

export default {
  name: 'ProgressCircularExample',
  components: { SmyProgressCircular },
}
</script>
