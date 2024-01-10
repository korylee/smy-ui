<template>
  <smy-checkbox v-model="checked" />
</template>

<script>
import { Checkbox } from '@smy-h5/ui'

export default {
  name: 'BasicExample',
  components: { SmyCheckbox: Checkbox },
}
</script>
