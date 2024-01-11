<template>
  <div>
    <app-demo-title>基础使用</app-demo-title>
    <div class="ripple-example__block" v-ripple></div>
    <div class="ripple-example__block" v-ripple="'#2979ff'"></div>
  </div>
</template>

<script>
import Ripple from '..'
import { AppDemoTitle } from '@smy-h5/cli/client'

export default {
  name: 'RippleExample',
  components: { AppDemoTitle },
  directives: { Ripple },
}
</script>

<style scoped lang="less">
.ripple-example__block {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: var(--site-config-color-sub-text);
  background: var(--site-config-color-sub-bar);
  user-select: none;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  transition: background-color 0.25s;
  margin: 15px;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.15);
}
</style>
