<template>
  <smy-radio-group v-model="value">
    <smy-radio value="a">单选框a</smy-radio>
    <smy-radio value="b">单选框b</smy-radio>
  </smy-radio-group>
</template>

<script>
import { Radio, RadioGroup } from '@smy-h5/ui'

export default {
  components: {
    SmyRadio: Radio,
    SmyRadioGroup: RadioGroup,
  },
  data: () => ({
    value: 'a',
  }),
}
</script>
