<template>
  <div class="smy-countdown-example">
    <div>
      <div>基础使用</div>
      <Countdown time="10800000" />
    </div>
    <div>
      <div>自定义格式化</div>
      <Countdown time="10800000" format="DD 天 HH 时 mm 分 ss 秒" />
    </div>
    <div>
      <div>展示毫秒</div>
      <Countdown time="108000000" format="HH : mm : ss : SSS" />
    </div>
    <div>
      <div>自定义样式</div>
      <Countdown time="108000000">
        <template #default="timeData">
          <span class="block">{{ timeData.hours }}</span>
          <span class="colon">:</span>
          <span class="block">{{ timeData.minutes }}</span>
          <span class="colon">:</span>
          <span class="block">{{ timeData.seconds }}</span>
        </template>
      </Countdown>
    </div>
  </div>
</template>

<script>
import Countdown from '../Countdown.vue'

export default {
  name: 'CountdownExample',
  components: { Countdown },
  methods: {},
}
</script>

<style lang="less" scoped>
.smy-countdown-example {
  .block {
    background: #ff9f00;
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .colon {
    margin: 0 5px;
    font-size: 18px;
    font-weight: 500;
  }
}
</style>
