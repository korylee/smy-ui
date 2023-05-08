<template>
  <div>
    <app-demo-title>基础用法</app-demo-title>
    <smy-cell insert title="请选择" @click="basicShow = true" />
    <smy-picker :show.sync="basicShow" :columns="[column]" title="请选择" @cancel="basicShow = false" />
    <app-demo-title>多列展示</app-demo-title>
    <smy-cell insert title="请选择" @click="multipShow = true" />
    <smy-picker :show.sync="multipShow" :columns="[column, column]" title="请选择" @cancel="multipShow = false" />
  </div>
</template>

<script>
import { AppDemoTitle } from '@smy-h5/cli/client'
import Picker from '../'
import SmyCell from '../../cell'

export default {
  name: 'PickerExample',
  components: { SmyPicker: Picker.Component, AppDemoTitle, SmyCell },
  data: () => ({
    basicShow: false,
    defaultShow: false,
    multipShow: false,
    column: Array.from({ length: 20 }, (_, index) => index),
  }),
}
</script>

<style lang="less" scoped></style>
