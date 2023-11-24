<template>
  <smy-countdown time="10800000" format="DD 天 HH 时 mm 分 ss 秒" />
</template>

<script>
import { Countdown as SmyCountdown } from '@smy-h5/ui'

export default {
  components: {
    SmyCountdown,
  },
}
</script>
