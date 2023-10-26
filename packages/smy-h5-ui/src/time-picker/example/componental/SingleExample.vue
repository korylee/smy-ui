<template>
  <div>
    <smy-cell insert :title="getTitle(basic)" @click="basic.show = true">
      <template #extra>popup: <smy-switch v-model="basic.popup" /></template>
    </smy-cell>
    <smy-date-picker
      v-model="basic.value"
      :show.sync="basic.show"
      :popup="basic.popup"
      :columns="[column]"
      title="请选择"
      @confirm="basic.show = false"
      @cancel="basic.show = false"
      @change="onChange"
    />
  </div>
</template>

<script>
import { Cell as SmyCell, Switch as SmySwitch, DatePicker } from '@smy-h5/ui'

const column = [
  { text: '南京市', value: 'NanJing' },
  { text: '无锡市', value: 'WuXi' },
  { text: '海北藏族自治区', value: 'ZangZu' },
  { text: '北京市', value: 'BeiJing' },
  { text: '连云港市', value: 'LianYunGang' },
  { text: '浙江市', value: 'ZheJiang' },
  { text: '江苏市', value: 'JiangSu' },
]

export default {
  components: { SmyCell, SmyDatePicker: DatePicker.Component, SmySwitch },
  data: () => ({
    basic: { show: false, value: undefined, popup: true },
    column,
  }),
  methods: {
    onChange(...args) {
      console.log(args)
    },
    getTitle(val) {
      return val?.value?.join(',') ?? '请选择'
    },
  },
}
</script>
