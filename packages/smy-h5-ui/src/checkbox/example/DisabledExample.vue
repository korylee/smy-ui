<template>
  <div>
    <smy-checkbox disabled>复选框</smy-checkbox>
    <smy-checkbox checked disabled>复选框</smy-checkbox>
  </div>
</template>

<script>
import { Checkbox } from '@smy-h5/ui'

export default {
  components: {
    SmyCheckbox: Checkbox,
  },
}
</script>
