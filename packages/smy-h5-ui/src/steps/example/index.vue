<template>
  <div class="steps-example">
    <Steps current="1" direction="vertical">
      <Step content="这里是该步骤的描述信息加长加长加长加长加长加长加长" title="已完成" />
      <Step />
      <Step />
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

<style></style>
