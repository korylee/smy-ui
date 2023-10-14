<template>
  <div class="steps-example">
    <app-demo-title>基础使用</app-demo-title>
    <smy-steps :current="current1" class="steps-wrapper" @click-step="onStep">
      <smy-step content="这里是该步骤的描述信息加长加长加长加长加长加长加长" title="已完成" />
      <smy-step />
      <smy-step />
    </smy-steps>
    <div class="steps-button">
      <button @click="handleNext('current1')">下一步</button>
    </div>
    <app-demo-title>基础使用(点状)</app-demo-title>
    <smy-steps :current="current1" progress-dot class="steps-wrapper">
      <smy-step />
      <smy-step />
      <smy-step />
    </smy-steps>
    <div class="steps-button">
      <button @click="handleNext('current1')">下一步</button>
    </div>
    <app-demo-title>竖向</app-demo-title>
    <smy-steps :current="current2" vertical class="steps-wrapper">
      <smy-step content="这里是该步骤的描述信息加长加长加长加长加长加长加长" title="已完成" />
      <smy-step />
      <smy-step />
    </smy-steps>
    <div class="steps-button">
      <button @click="handleNext('current2')">下一步</button>
    </div>
    <app-demo-title>点状</app-demo-title>
    <smy-steps current="1" vertical progress-dot class="steps-wrapper">
      <smy-step content="这里是该步骤的描述信息加长加长加长加长加长加长加长" title="已完成" />
      <smy-step v-for="item of 3" :key="item" content="fasdfad" />
    </smy-steps>
    <app-demo-title>翻转</app-demo-title>
    <smy-steps current="1" reverse vertical progress-dot class="steps-wrapper">
      <smy-step>
        <template #title>
          <span>收货地址：广东省深圳市福田区梅林街道新一代产业园5栋</span>
        </template>
        刘一飞 18889898888
      </smy-step>
      <smy-step v-for="item of 3" :key="item" content="fasdfad" />
    </smy-steps>
  </div>
</template>

<script>
import SmySteps from '..'
import SmyStep from '../../step'
import { AppDemoTitle } from '@smy-h5/cli/client'

export default {
  name: 'StepsExample',
  components: { SmySteps, SmyStep, AppDemoTitle },
  data: () => ({
    current1: 0,
    current2: 1,
  }),
  methods: {
    handleNext(key) {
      if (this[key] >= 2) {
        this[key] = 0
      } else {
        this[key] += 1
      }
    },
    onStep(index) {
      console.log(index)
    },
  },
}
</script>

<style lang="less" scoped>
.steps-wrapper {
  padding: 15px 30px;
}
</style>
