<template>
  <div>
    <h4>函数式使用</h4>
    <smy-cell insert title="基础使用" @click="showBasicPicker" />
    <app-demo-title>基础使用</app-demo-title>
  </div>
</template>

<script>
import { AppDemoTitle } from '@smy-h5/cli/client'
import { Cell, TimePicker, Toast } from '@smy-h5/ui'

export default {
  name: 'TimePickerExample',
  components: { AppDemoTitle, SmyCell: Cell },
  methods: {
    showBasicPicker() {
      TimePicker({
        columnsType: ['hour', 'minute', 'second'],
      }).then(({ state, values, indexes }) => {
        Toast(`${state}: ${values}`)
        console.log(state, values, indexes)
      })
    },
  },
}
</script>
