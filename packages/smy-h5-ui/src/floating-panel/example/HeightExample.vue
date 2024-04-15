<template>
  <smy-floating-panel :height.sync="height" :anchors="anchors">
    <div>高度： {{ height.toFixed(0) }}</div>
  </smy-floating-panel>
</template>

<script>
import { FloatingPanel } from '@smy-h5/ui'

const anchors = [100, Math.round(0.4 * window.innerHeight), Math.round(0.7 * window.innerHeight)]

export default {
  name: 'FloatingPanelExample',
  components: { SmyFloatingPanel: FloatingPanel },
  data: () => ({
    height: anchors[0],
    anchors,
  }),
}
</script>
