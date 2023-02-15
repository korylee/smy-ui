<template>
  <div class="steps-example">
    <div>基础使用</div>
    <smy-steps :current="current1" class="steps-wrapper">
      <Step content="这里是该步骤的描述信息加长加长加长加长加长加长加长" title="已完成" />
      <Step />
      <Step />
    </smy-steps>
    <div class="steps-button">
      <button @click="handleStep('current1')">下一步</button>
    </div>
    <div>基础使用(点状)</div>
    <smy-steps :current="current1" progress-dot class="steps-wrapper">
      <Step />
      <Step />
      <Step />
    </smy-steps>
    <div class="steps-button">
      <button @click="handleStep('current1')">下一步</button>
    </div>
    <div>竖向</div>
    <smy-steps :current="current2" vertical class="steps-wrapper">
      <Step content="这里是该步骤的描述信息加长加长加长加长加长加长加长" title="已完成" />
      <Step />
      <Step />
    </smy-steps>
    <div class="steps-button">
      <button @click="handleStep('current2')">下一步</button>
    </div>
    <div>点状</div>
    <smy-steps current="1" vertical progress-dot class="steps-wrapper">
      <Step content="这里是该步骤的描述信息加长加长加长加长加长加长加长" title="已完成" />
      <Step v-for="item of 3" :key="item" content="fasdfad" />
    </smy-steps>
    <div>翻转</div>
    <smy-steps current="1" reverse vertical progress-dot class="steps-wrapper">
      <Step>
        <template #title>
          <span>收货地址：广东省深圳市福田区梅林街道新一代产业园5栋</span>
        </template>
        刘一飞 18889898888
      </Step>
      <Step v-for="item of 3" :key="item" content="fasdfad" />
    </smy-steps>
  </div>
</template>

<script>
import SmySteps from '..'
import Step from '../../step'

export default {
  name: 'StepsExample',
  components: { SmySteps, Step },
  data: () => ({
    current1: 0,
    current2: 0,
  }),
  methods: {
    handleStep(key) {
      if (this[key] >= 2) {
        this[key] = 0
      } else {
        this[key] += 1
      }
    },
  },
}
</script>

<style lang="less" scoped>
.steps-wrapper {
  padding: 15px 30px;
}
</style>
