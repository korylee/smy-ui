<template>
  <div class="swipe-example">
    <app-demo-title>基础用法</app-demo-title>
    <basic-example />
    <app-demo-title>禁用滑动</app-demo-title>
    <disabled-example />
    <app-demo-title>左右滑动</app-demo-title>
    <swipe-example />
  </div>
</template>

<script>
import { AppDemoTitle } from '@smy-h5/cli/client'
import BasicExample from './BasicExample.vue'
import DisabledExample from './DisabledExample.vue'
import SwipeExample from './SwipeExample.vue'

export default {
  name: 'SwipeExpamle',
  components: { AppDemoTitle, BasicExample, DisabledExample, SwipeExample },
}
</script>

<style lang="less" scoped>
.swipe-example {
  overflow: hidden;
}
.btn {
  position: relative;
  display: inline-block;
  width: auto;
  flex-shrink: 0;
  height: 38px;
  box-sizing: border-box;
  margin: 0px;
  line-height: 36px;
  padding: 0px 18px;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  transition: opacity 0.2s ease 0s;
  appearance: none;
  user-select: none;
  touch-action: manipulation;
  vertical-align: bottom;
  -webkit-tap-highlight-color: transparent;
}
.delete-btn {
  height: 100%;
  color: rgb(255, 255, 255);
  background: rgb(250, 44, 25);
  border: 1px solid transparent;
}
.choose-btn {
  color: rgb(255, 255, 255);
  background: linear-gradient(
    135deg,
    rgb(38, 191, 38) 0%,
    rgb(39, 197, 48) 45%,
    rgb(40, 207, 63) 83%,
    rgb(41, 212, 70) 100%
  );
  border: 1px solid transparent;
  height: 100%;
}
</style>
