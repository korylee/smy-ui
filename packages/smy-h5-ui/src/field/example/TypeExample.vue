<template>
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
</template>
<script>
import { Field as SmyField, Cell as SmyCell, CellGroup as SmyCellGroup } from '@smy-h5/ui'

export default {
  components: { SmyField, SmyCell, SmyCellGroup },
  data: () => ({
    customType: {},
  }),
}
</script>
