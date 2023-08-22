<template>
  <div>
    <app-demo-title>基础用法</app-demo-title>
    <smy-cell>
      <smy-input v-model="basic" placeholder="请输入" />
    </smy-cell>
    <app-demo-title>自定义类型</app-demo-title>
    <smy-cell-group border>
      <smy-cell border>
        <smy-input v-model="customType.text" placeholder="请输入文本" />
      </smy-cell>
      <smy-cell border>
        <smy-input v-model="customType.tel" type="tel" placeholder="请输入手机号" />
      </smy-cell>
      <smy-cell border>
        <smy-input v-model="customType.digit" type="digit" placeholder="请输入整数" />
      </smy-cell>
      <smy-cell border>
        <smy-input v-model="customType.number" type="number" placeholder="请输入数字（支持小数）" />
      </smy-cell>
      <smy-cell border>
        <smy-input v-model="customType.password" type="password" placeholder="请输入密码" />
      </smy-cell>
    </smy-cell-group>
    <app-demo-title>禁用输入框</app-demo-title>
    <smy-cell-group border>
      <smy-cell border>
        <smy-input value="输入框只读" readonly placeholder="输入框只读" />
      </smy-cell>
      <smy-cell>
        <smy-input value="输入框禁用" disabled placeholder="输入框禁用" />
      </smy-cell>
    </smy-cell-group>
    <app-demo-title>textarea</app-demo-title>
    <smy-cell>
      <smy-input v-model="basic" type="textarea" placeholder="请输入" />
    </smy-cell>

    <app-demo-title>autosize textarea</app-demo-title>
    <smy-cell>
      <smy-input v-model="basic" autosize type="textarea" placeholder="请输入" />
    </smy-cell>
  </div>
</template>

<script>
import { AppDemoTitle } from '@smy-h5/cli/client'
import SmyInput from '..'
import SmyCell from '../../cell'
import SmyCellGroup from '../../cell-group'

export default {
  name: 'InputExample',
  components: { SmyInput, SmyCell, AppDemoTitle, SmyCellGroup },
  data: () => ({
    basic: '',
    customType: {},
  }),
}
</script>
