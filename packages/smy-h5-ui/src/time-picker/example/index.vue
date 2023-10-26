<template>
  <div>
    <h4>函数式使用</h4>
    <smy-cell insert title="基础使用" @click="showBasicPicker" />
    <app-demo-title>基础使用</app-demo-title>
  </div>
</template>

<script>
import { AppDemoTitle } from '@smy-h5/cli/client'
import { Cell, TimePicker } from '@smy-h5/ui'

export default {
  name: 'TimePickerExample',
  components: { AppDemoTitle, SmyCell: Cell },
  methods: {
    showBasicPicker() {
      TimePicker({
        columnsType: ['hour'],
      })
    },
  },
}
</script>
