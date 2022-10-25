<template>
  <div class="smy-price">
    <span v-if="needSymbol" class="smy-price__symbol">￥</span>
    <span class="smy-price__big">{{ humpPrice.big }}</span>
    <span class="smy-price__point">.</span>
    <span class="smy-price__small">{{ humpPrice.small }}</span>
  </div>
</template>

<script>
import { props } from './props'
// 判断是否有小数点
const checkPoint = (num) => ~String(num).indexOf('.')

export default {
  name: 'SmyPrice',
  props,
  computed: {
    humpPrice({ price }) {
      price = String(price).replace('￥', '')
      if (!checkPoint(price)) {
        return {
          big: this.formatThousands(price),
          small: this.formatDecimal(0),
        }
      }
      const numArray = Number(price).toFixed(this.decimalDigits).split('.')
      return {
        big: this.formatThousands(numArray[0]),
        small: this.formatDecimal(numArray[1]),
      }
    },
  },
  methods: {
    formatDecimal(decimalNum) {
      const { decimalDigits } = this
      const result = '0.' + String(decimalNum)
      const resultFixed = (result / 1).toFixed(decimalDigits)
      return String(resultFixed).substring(2, resultFixed.length)
    },
    formatThousands(num) {
      if (!this.thousands) return num
      return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    },
  },
}
</script>

<style lang="less">
@import './price.less';
</style>
