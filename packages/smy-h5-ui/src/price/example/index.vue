<template>
  <div>
    <h4>基本用法</h4>
    <p>无人民币符号，有千位分隔</p>
    <Price :price="101054545454" :need-symbol="false" :thousands="true" />
    <p>带人民币符号，无千位分隔</p>
    <Price :price="10010.01" need-symbol :thousands="false" />
    <p>带人民币符号，有千位分隔，保留小数点后三位</p>
    <Price :price="15213.1221" :decimalDigits="3" need-symbol thousands />
  </div>
</template>

<script>
import Price from '../Price.vue'
export default {
  name: 'PriceExample',
  components: { Price },
}
</script>

<style></style>
