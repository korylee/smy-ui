<template>
  <div class="steps-example">
    <div>基础使用</div>
    <Steps current="1" direction="vertical" class="steps-wrapper">
      <Step content="这里是该步骤的描述信息加长加长加长加长加长加长加长" title="已完成" />
      <Step />
      <Step />
    </Steps>
    <div>点状</div>
    <Steps current="1" direction="vertical" progress-dot class="steps-wrapper">
      <Step content="这里是该步骤的描述信息加长加长加长加长加长加长加长" title="已完成" />
      <Step v-for="item of 3" :key="item" content="fasdfad" />
    </Steps>
    <div>翻转</div>
    <Steps current="1" reverse direction="vertical" progress-dot class="steps-wrapper">
      <Step>
        <template #title>
          <span>收货地址：广东省深圳市福田区梅林街道新一代产业园5栋</span>
        </template>
        刘一飞 18889898888
      </Step>
      <Step v-for="item of 3" :key="item" content="fasdfad" />
    </Steps>
  </div>
</template>

<script>
import Steps from '../Steps'
import Step from '../../step/Step'

export default {
  name: 'StepsExample',
  components: { Steps, Step },
}
</script>

<style lang="less" scoped>
.steps-wrapper {
  padding: 15px 30px;
}
</style>
