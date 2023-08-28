<template>
  <div>
    <app-demo-title>基础用法</app-demo-title>
    <smy-cell>
      <smy-field v-model="basic" placeholder="请输入" />
    </smy-cell>
    <app-demo-title>自定义类型</app-demo-title>
    <smy-cell-group>
      <smy-cell border>
        <smy-field v-model="customType.text" placeholder="请输入文本" />
      </smy-cell>
      <smy-cell border>
        <smy-field v-model="customType.tel" type="tel" placeholder="请输入手机号" />
      </smy-cell>
      <smy-cell border>
        <smy-field v-model="customType.digit" type="digit" placeholder="请输入整数" />
      </smy-cell>
      <smy-cell border>
        <smy-field v-model="customType.number" type="number" placeholder="请输入数字（支持小数）" />
      </smy-cell>
      <smy-cell border>
        <smy-field v-model="customType.password" type="password" placeholder="请输入密码" />
      </smy-cell>
    </smy-cell-group>
    <app-demo-title>禁用输入框</app-demo-title>
    <smy-cell-group>
      <smy-cell border>
        <smy-field value="输入框只读" readonly placeholder="输入框只读" />
      </smy-cell>
      <smy-cell>
        <smy-field value="输入框禁用" disabled placeholder="输入框禁用" />
      </smy-cell>
    </smy-cell-group>
    <app-demo-title>显示图标</app-demo-title>
    <smy-cell-group>
      <smy-cell>
        <smy-field v-model="icon.clear" placeholder="显示清除图标" clearable />
      </smy-cell>
    </smy-cell-group>
    <app-demo-title>插入按钮</app-demo-title>
    <smy-cell>
      <smy-field v-model="wordLimit" placeholder="请输入">
        <template #button><button>发送验证码</button></template>
      </smy-field>
    </smy-cell>
    <app-demo-title>显示字数统计</app-demo-title>
    <smy-cell>
      <smy-field v-model="wordLimit" type="textarea" show-word-limit maxlength="50" placeholder="请输入" />
    </smy-cell>
    <app-demo-title>高度自适应</app-demo-title>
    <smy-cell>
      <smy-field v-model="autosize" rows="1" autosize type="textarea" placeholder="请输入" />
    </smy-cell>
  </div>
</template>

<script>
import { AppDemoTitle } from '@smy-h5/cli/client'
import SmyField from '..'
import SmyCell from '../../cell'
import SmyCellGroup from '../../cell-group'

export default {
  name: 'InputExample',
  components: { SmyField, SmyCell, AppDemoTitle, SmyCellGroup },
  data: () => ({
    basic: '',
    customType: {},
    icon: {},
    wordLimit: '',
    autosize: '',
  }),
}
</script>
