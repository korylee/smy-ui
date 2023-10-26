<template>
  <div>
    <smy-picker-group :active-tab.sync="activeTab" :popup="false" :tabs="['test', 'test2']" nextStepText="next">
      <smy-date-picker
        :min-date="new Date(2023, 10, 23)"
        :max-date="new Date(2024, 5, 23)"
        :columns-type="['year', 'month', 'day']"
      >
        <template #top>1</template>
        <template #test2>2</template>
        <div slot="test3"></div>
      </smy-date-picker>
      <smy-date-picker
        :min-date="new Date(2023, 10, 23)"
        :max-date="new Date(2024, 5, 23)"
        :columns-type="['year', 'month', 'day']"
      />
    </smy-picker-group>
  </div>
</template>

<script>
import SmyPickerGroup from '../PickerGroup.jsx'
import DatePicker from '../../date-picker'

export default {
  name: 'PickerGroupExmaple',
  components: {
    SmyPickerGroup,
    SmyDatePicker: DatePicker.Component,
  },
  data: () => ({ activeTab: 0 }),
}
</script>
