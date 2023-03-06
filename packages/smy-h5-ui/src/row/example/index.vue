<template>
  <div>
    <div class="demo-item">
      <smy-row>
        <smy-col class="flex-item">span:24</smy-col>
      </smy-row>
      <smy-row>
        <smy-col class="flex-item" span="12">span:12</smy-col>
        <smy-col class="flex-item" span="12">span:12</smy-col>
      </smy-row>
      <smy-row>
        <smy-col class="flex-item" span="8">span:8</smy-col>
        <smy-col class="flex-item flex-item--light" span="8">span:8</smy-col>
        <smy-col class="flex-item" span="8">span:8</smy-col>
      </smy-row>
      <smy-row>
        <smy-col class="flex-item" span="6">span:6</smy-col>
        <smy-col class="flex-item flex-item--light" span="6">span:6</smy-col>
        <smy-col class="flex-item" span="6">span:6</smy-col>
        <smy-col class="flex-item" span="6">span:6</smy-col>
      </smy-row>
    </div>
    偏移
    <smy-row wrap="wrap">
      <smy-col offset="8" span="16">
        <div class="flex-item">span:8</div>
      </smy-col>
      <smy-col span="8">
        <div class="flex-item flex-item--light">span:8</div>
      </smy-col>
      <smy-col span="8">
        <div class="flex-item">span:8</div>
      </smy-col>
    </smy-row>
    对齐
    <div class="demo-item">
      <smy-row>
        <smy-col span="8"> <div class="flex-item">span:8</div> </smy-col>
        <smy-col span="8"> <div class="flex-item">span:8</div> </smy-col>
      </smy-row>
      <smy-row justify="center">
        <smy-col span="8"> <div class="flex-item">span:8</div> </smy-col>
        <smy-col span="8"> <div class="flex-item">span:8</div> </smy-col>
      </smy-row>
    </div>
    分栏间隔
    <smy-row :gutter="10">
      <smy-col span="8">
        <div class="flex-item">span:8</div>
      </smy-col>
      <smy-col span="8">
        <div class="flex-item flex-item--light">span:8</div>
      </smy-col>
      <smy-col span="8">
        <div class="flex-item">span:8</div>
      </smy-col>
    </smy-row>
  </div>
</template>
<script>
import SmyRow from '../'
import SmyCol from '../../col'

export default {
  name: 'LayoutExample',
  components: { SmyRow, SmyCol },
}
</script>
<style lang="less">
.smy-row {
  overflow: hidden;
  &:not(:last-child) .smy-col {
    margin-bottom: 15px;
  }
}

.demo-item {
  margin-bottom: 20px;
  padding: 20px 0;
}

.flex-item {
  line-height: 40px;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  background: #ff8881;
  font-size: 12px;

  &--light {
    background: #ffc7c4;
  }
  &-height {
    height: 50px;
  }
}
</style>
