<template>
  <smy-checkbox-group v-model="value">
    <smy-checkbox value="a">复选框a</smy-checkbox>
    <smy-checkbox value="b">复选框b</smy-checkbox>
  </smy-checkbox-group>
</template>

<script>
import { Checkbox, CheckboxGroup } from '@smy-h5/ui'

export default {
  components: {
    SmyCheckbox: Checkbox,
    SmyCheckboxGroup: CheckboxGroup,
  },
  data: () => ({
    value: ['a', 'b'],
  }),
}
</script>
