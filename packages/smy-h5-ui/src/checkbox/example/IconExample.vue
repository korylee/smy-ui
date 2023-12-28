<template>
  <smy-checkbox v-model="value" :preset="false">
    <template #icon="{ checked }"> <smy-icon :name="checked ? activeIcon : inactiveIcon" /></template>
  </smy-checkbox>
</template>

<script>
import { Checkbox, Icon } from '@smy-h5/ui'

export default {
  components: {
    SmyCheckbox: Checkbox,
    SmyIcon: Icon,
  },
  data: () => ({
    value: true,
    activeIcon: 'https://fastly.jsdelivr.net/npm/@vant/assets/user-active.png',
    inactiveIcon: 'https://fastly.jsdelivr.net/npm/@vant/assets/user-inactive.png',
  }),
}
</script>
