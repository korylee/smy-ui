<template>
  <div>
    <smy-checkbox v-model="isCheckAll" :indeterminate="isInterminate">全选</smy-checkbox>
    <smy-divider class="divider" />
    <smy-checkbox-group v-model="value">
      <smy-checkbox v-for="item of list" :key="item" :value="item">复选框{{ item }}</smy-checkbox>
    </smy-checkbox-group>
  </div>
</template>

<script>
import { Checkbox, CheckboxGroup, Divider } from '@smy-h5/ui'

export default {
  components: {
    SmyCheckbox: Checkbox,
    SmyCheckboxGroup: CheckboxGroup,
    SmyDivider: Divider,
  },
  data: () => ({
    list: ['a', 'b', 'c'],
    value: ['a', 'b'],
  }),
  computed: {
    isCheckAll: {
      get() {
        return this.value.length === this.list.length
      },
      set(val) {
        if (val) {
          this.value = this.list
        } else {
          this.value = []
        }
      },
    },
    isInterminate() {
      const { value, list } = this
      return value.length > 0 && value.length < list.length
    },
  },
}
</script>

<style>
.divider {
  --divider-margin: 16px;
}
</style>
