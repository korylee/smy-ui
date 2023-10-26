<template>
  <div>
    <h4>函数式使用</h4>
    <smy-cell insert title="基础使用" @click="showBasicPicker" />
    <app-demo-title>基础使用</app-demo-title>
  </div>
</template>

<script>
import { AppDemoTitle } from '@smy-h5/cli/client'
import { Cell, DatePicker } from '@smy-h5/ui'

export default {
  name: 'DatePickerExample',
  components: { AppDemoTitle, SmyCell: Cell },
  methods: {
    showBasicPicker() {
      DatePicker({
        columnsType: ['year', 'month', 'day'],
        minDate: new Date(2023, 10, 21),
        maxDate: new Date(2024, 5, 23),
      })
    },
  },
}
</script>
