<template>
  <smy-checkbox-group v-model="value">
    <smy-checkbox v-for="item in list" :key="item" :shape="item" :value="item">shape: {{ item }}</smy-checkbox>
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
    value: [],
    list: ['square', 'round', 'plain'],
  }),
}
</script>
