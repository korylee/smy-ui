<template>
  <div>
    <app-demo-title>基础使用</app-demo-title>
    <smy-cell>
      <smy-progress-circular :value="value" size="50" />
      <template #extra>
        <div class="smy--flex">value:<smy-stepper v-model="value" max="100" /></div>
      </template>
    </smy-cell>
    <app-demo-title>颜色</app-demo-title>
    <smy-cell>
      <smy-progress-circular size="30" value="20" color="#f38181" bg-color="#fce38a" />
    </smy-cell>
    <app-demo-title>indeterminate状态</app-demo-title>
    <smy-cell>
      <smy-progress-circular :indeterminate="indeterminate" value="20" size="30" />
      <template #extra>
        <div>indeterminate <smy-swtich v-model="indeterminate" /></div>
      </template>
    </smy-cell>
    <app-demo-title>大小和宽度</app-demo-title>
    <smy-cell>
      <smy-progress-circular indeterminate size="40" width="9" />
      <smy-progress-circular indeterminate size="50" width="7" />
      <smy-progress-circular indeterminate size="60" width="5" />
      <smy-progress-circular indeterminate size="70" width="3" />
      <smy-progress-circular indeterminate size="80" width="1" />
    </smy-cell>
    <app-demo-title>Rotate</app-demo-title>
    <smy-cell>
      <smy-progress-circular :value="rotateValue" rotate="360" color="#009688" size="60" width="6">
        {{ rotateValue }}
      </smy-progress-circular>
      <smy-progress-circular :value="rotateValue" rotate="-90" color="#f0932b" size="60" width="6">
        {{ rotateValue }}
      </smy-progress-circular>
      <smy-progress-circular :value="rotateValue" rotate="90" color="#f44336" size="60" width="6">
        {{ rotateValue }}
      </smy-progress-circular>
      <smy-progress-circular :value="rotateValue" rotate="180" color="#1e90ff" size="60" width="6">
        {{ rotateValue }}
      </smy-progress-circular>
    </smy-cell>
  </div>
</template>
<script>
import { AppDemoTitle } from '@smy-h5/cli/client'
import SmyProgressCircular from '..'
import SmyCell from '../../cell'
import SmySwtich from '../../switch'
import SmyStepper from '../../stepper'

export default {
  name: 'ProgressCircularExample',
  components: { SmyProgressCircular, AppDemoTitle, SmyCell, SmySwtich, SmyStepper },
  data: () => ({ indeterminate: true, value: 20, interval: undefined, rotateValue: 0 }),
  mounted() {
    this.interval = setInterval(() => {
      if (this.rotateValue === 100) {
        this.rotateValue = 0
        return
      }
      this.rotateValue += 10
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
}
</script>
