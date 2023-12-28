<template>
  <smy-radio-group v-model="value" :shape="shape">
    <div class="shape-group">
      <div
        v-for="item of shapes"
        :key="item"
        :class="['shape', item === shape ? 'active' : '']"
        @click="onChangeShape(item)"
      >
        {{ item }}
      </div>
    </div>
    <smy-radio value="a">复选框a</smy-radio>
    <smy-radio value="b">复选框b</smy-radio>
  </smy-radio-group>
</template>

<script>
import { Radio, RadioGroup } from '@smy-h5/ui'

export default {
  components: {
    SmyRadio: Radio,
    SmyRadioGroup: RadioGroup,
  },
  data: () => ({
    value: 'a',
    shape: 'round',
    shapes: ['round', 'square', 'dot'],
  }),
  methods: {
    onChangeShape(value) {
      this.shape = value
    },
  },
}
</script>

<style lang="less" scoped>
.shape-group {
  display: inline-flex;
  margin: 0 0 6px 6px;
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
}
.shape {
  width: 60px;
  display: inline-block;
  text-align: center;
  font-size: 16px;
  line-height: 30px;
  transition: all 0.2s;
  &.active {
    background: #ff8787;
    color: #fff;
  }
}
</style>
