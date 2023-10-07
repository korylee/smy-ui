<template>
  <smy-cell-group>
    <smy-cell border>
      <smy-field value="输入框只读" readonly placeholder="输入框只读" />
    </smy-cell>
    <smy-cell>
      <smy-field value="输入框禁用" disabled placeholder="输入框禁用" />
    </smy-cell>
  </smy-cell-group>
</template>
<script>
import { Field as SmyField, Cell as SmyCell, CellGroup as SmyCellGroup } from '@smy-h5/ui'

export default {
  components: { SmyField, SmyCell, SmyCellGroup },
}
</script>
