<template>
  <div class="smy-countdown-example">
    <div>基础使用</div>
    <smy-countdown time="10800000" />
    <div>自定义格式化</div>
    <smy-countdown time="10800000" format="DD 天 HH 时 mm 分 ss 秒" />
    <div>展示毫秒</div>
    <smy-countdown time="108000000" format="HH : mm : ss : SSS" />
    <div>控制开始和暂停的倒计时</div>
    <smy-cell
      ><smy-countdown :paused.sync="paused" time="10800000" @pause="onpause" @start="onstart" />
      <template #extra>
        <button @click="togglePaused">{{ paused ? 'start' : 'stop' }}</button></template
      ></smy-cell
    >
    <div>自定义样式</div>
    <smy-countdown time="108000000">
      <template #default="timeData">
        <span class="block">{{ timeData.hours }}</span>
        <span class="colon">:</span>
        <span class="block">{{ timeData.minutes }}</span>
        <span class="colon">:</span>
        <span class="block">{{ timeData.seconds }}</span>
      </template>
    </smy-countdown>
    <div>手动控制</div>
    <smy-countdown ref="countdown" time="3000" :auto-start="false" format="ss : SSS" @end="onEnd" @change="onChange" />
    <div class="btn-container">
      <button @click="$refs.countdown.start()">start</button>
      <button @click="$refs.countdown.pause()">pause</button>
      <button @click="$refs.countdown.reset()">reset</button>
    </div>
  </div>
</template>

<script>
import SmyCountdown from '../'
import SmyCell from '../../cell'

export default {
  name: 'CountdownExample',
  components: { SmyCountdown, SmyCell },
  data: () => ({
    end: Date.now() + 60 * 1000,
    paused: true,
  }),
  methods: {
    onpause() {
      console.log('pause')
    },
    onstart() {
      console.log('start')
    },
    onEnd() {
      console.log('end!')
    },
    onChange() {
      console.log('change')
    },
    togglePaused() {
      this.paused = !this.paused
    },
  },
}
</script>

<style lang="less" scoped>
.btn-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 10px;
}
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
