<template>
  <smy-floating-panel>
    <smy-cell-group>
      <smy-cell v-for="i in 26" :key="i" :title="String.fromCharCode(i + 64)" />
    </smy-cell-group>
  </smy-floating-panel>
</template>

<script>
import { FloatingPanel, Cell, CellGroup } from '@smy-h5/ui'

export default {
  name: 'FloatingPanelExample',
  components: { SmyFloatingPanel: FloatingPanel, SmyCell: Cell, SmyCellGroup: CellGroup },
}
</script>
