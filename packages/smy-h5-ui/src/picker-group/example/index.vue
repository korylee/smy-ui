<template>
  <div>
    <smy-picker-group
      :active-tab.sync="activeTab"
      :popup="false"
      :tabs="['选择日期', '选择时间']"
      next-step-text="下一步"
      @confirm="onConfirm"
    >
      <smy-date-picker
        :value.sync="currentDate"
        :min-date="new Date(2023, 10, 23)"
        :max-date="new Date(2024, 5, 23)"
        :columns-type="['year', 'month', 'day']"
      />
      <smy-time-picker :value.sync="currentTime" />
    </smy-picker-group>
  </div>
</template>

<script>
import SmyPickerGroup from '..'
import DatePicker from '../../date-picker'
import TimePicker from '../../time-picker'

export default {
  name: 'PickerGroupExmaple',
  components: {
    SmyPickerGroup,
    SmyDatePicker: DatePicker.Component,
    SmyTimePicker: TimePicker.Component,
  },
  data: () => ({ activeTab: 0, currentDate: [], currentTime: [] }),
  methods: {
    onConfirm(...args) {
      console.log(args)
    },
  },
}
</script>
