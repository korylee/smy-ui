<template>
  <div>
    <h4>函数调用</h4>
    <smy-cell insert title="单列选择" @click="showBasicPicker" />
    <smy-cell insert title="多列选择" @click="showMultiplePicker" />
    <smy-cell insert title="级联选择" @click="showCascadePicker" />
    <smy-cell insert title="默认选中项" @click="showDefaultSelectedPicker" />

    <h4>组件调用</h4>
    <app-demo-title>单列选择</app-demo-title>
    <componental-single-example />
    <app-demo-title>多列选择</app-demo-title>
    <smy-cell insert :title="getTitle(multiple)" @click="multiple.show = true">
      <template #extra>popup: <smy-switch v-model="multiple.popup" /></template>
    </smy-cell>
    <smy-picker
      v-model="multiple.value"
      :show.sync="multiple.show"
      :columns="multipleColumns"
      :popup="multiple.popup"
      title="请选择"
      @cancel="multiple.show = false"
      @confirm="multiple.show = false"
      @change="onChange"
    />
    <app-demo-title>级联选择</app-demo-title>
    <smy-cell insert :title="getTitle(cascade)" @click="cascade.show = true">
      <template #extra>popup: <smy-switch v-model="cascade.popup" /></template>
    </smy-cell>
    <smy-picker
      v-model="cascade.value"
      :show.sync="cascade.show"
      :columns="cascadeColumns"
      :popup="cascade.popup"
      cascade
      title="请选择"
      item-text="text"
      item-value="text"
      @cancel="cascade.show = false"
      @confirm="cascade.show = false"
      @change="onChange"
    />
    <app-demo-title>默认选中项</app-demo-title>
    <smy-cell insert :title="getTitle(defaultValue)" @click="defaultValue.show = true">
      <template #extra>popup: <smy-switch v-model="defaultValue.popup" /></template>
    </smy-cell>
    <smy-picker
      v-model="defaultValue.value"
      :show.sync="defaultValue.show"
      :columns="multipleColumns"
      :popup="defaultValue.popup"
      title="请选择"
      @cancel="defaultValue.show = false"
      @confirm="defaultValue.show = false"
      @change="onChange"
    />
  </div>
</template>

<script>
import { AppDemoTitle } from '@smy-h5/cli/client'
import { Cell as SmyCell, CellGroup as SmyCellGroup, Switch as SmySwitch, Toast, Picker } from '@smy-h5/ui'
import ComponentalSingleExample from '../example/componental/SingleExample.vue'

const cascadeColumns = [
  {
    text: '北京市',
    children: [
      {
        text: '市辖区1',
        children: [
          {
            text: '东城区',
          },
          {
            text: '西城区',
          },
        ],
      },
    ],
  },
  {
    text: '天津市',
    children: [
      {
        text: '市辖区2',
        children: [
          {
            text: '和平区',
          },
          {
            text: '河东区',
          },
        ],
      },
    ],
  },
]

const column = [
  { text: '南京市', value: 'NanJing' },
  { text: '无锡市', value: 'WuXi' },
  { text: '海北藏族自治区', value: 'ZangZu' },
  { text: '北京市', value: 'BeiJing' },
  { text: '连云港市', value: 'LianYunGang' },
  { text: '浙江市', value: 'ZheJiang' },
  { text: '江苏市', value: 'JiangSu' },
]

const multipleColumns = [
  [
    { text: '周一', value: 'Monday' },
    { text: '周二', value: 'Tuesday' },
    { text: '周三', value: 'Wednesday' },
    { text: '周四', value: 'Thursday' },
    { text: '周五', value: 'Friday' },
  ],
  [
    { text: '上午', value: 'Morning' },
    { text: '下午', value: 'Afternoon' },
    { text: '晚上', value: 'Evening' },
  ],
]

export default {
  name: 'PickerExample',
  components: { ComponentalSingleExample, SmyPicker: Picker.Component, AppDemoTitle, SmyCell, SmySwitch, SmyCellGroup },
  data: () => ({
    basic: { show: false, value: undefined, popup: true },
    multiple: { show: false, value: undefined, popup: true },
    cascade: { show: false, value: undefined, popup: true },
    defaultValue: { show: false, value: ['Tuesday', 'Afternoon'], popup: true },
    column,
    multipleColumns,
    cascadeColumns,
  }),
  methods: {
    onChange(...args) {
      console.log(args)
    },
    getTitle(val) {
      return val?.value?.join(',') ?? '请选择'
    },
    showBasicPicker() {
      Picker([column]).then(({ state, values, indexes }) => {
        Toast(`${state}: ${values}`)
        console.log(state, values, indexes)
      })
    },
    showMultiplePicker() {
      Picker(multipleColumns).then(({ state, values, indexes }) => {
        Toast(`${state}: ${values}`)
        console.log(state, values, indexes)
      })
    },
    showCascadePicker() {
      Picker({ cascade: true, columns: cascadeColumns, itemText: 'text', itemValue: 'text' }).then(
        ({ state, values, indexes }) => {
          Toast(`${state}: ${values}`)
          console.log(state, values, indexes)
        }
      )
    },
    showDefaultSelectedPicker() {
      Picker({ columns: multipleColumns, value: ['Tuesday', 'Afternoon'] }).then(({ state, values, indexes }) => {
        Toast(`${state}: ${values}`)
        console.log(state, values, indexes)
      })
    },
  },
}
</script>

<style lang="less" scoped>
.smy-cell {
  margin: 6px 4px;
}
</style>
