<template>
  <div>
    <app-demo-title>基础用法</app-demo-title>
    <smy-swipe>
      <smy-cell title="基本用法" insert></smy-cell>
      <template #right>
        <div class="delete-btn btn">删除</div>
      </template>
    </smy-swipe>
    <app-demo-title>禁用滑动</app-demo-title>
    <smy-swipe disabled>
      <smy-cell title="禁用滑动" insert></smy-cell>
      <template #right>
        <div class="delete-btn btn">删除</div>
      </template>
    </smy-swipe>
    <app-demo-title>左右滑动</app-demo-title>
    <smy-swipe ref="test" @click="onClick('cell')">
      <smy-cell title="左滑右滑" insert></smy-cell>
      <template #left>
        <div class="choose-btn btn" @click="onClick('left')">选择</div>
      </template>
      <template #right>
        <div class="delete-btn btn" @click="onClick('right')">删除</div>
      </template>
    </smy-swipe>
  </div>
</template>

<script>
import SmySwipe from '../Swipe.vue'
import SmyCell from '../../cell'
import { AppDemoTitle } from '@smy-h5/cli/client'

export default {
  name: 'SwipeExpamle',
  components: { SmySwipe, SmyCell, AppDemoTitle },
  methods: {
    onClick(name) {
      console.log(name)
    },
  },
}
</script>

<style lang="less" scoped>
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
