<template>
  <div class="smy-site-code-example">
    <div class="smy-site-code-example__toolbar">
      <smy-site-button v-if="fold && !disabledFold" @click="handleToggle" text round>
        <smy-site-icon size="18">
          <Xml />
        </smy-site-icon>
      </smy-site-button>
      <smy-site-button v-if="clipboard" @click="handleCopy" text round>
        <smy-site-icon size="18">
          <Copy />
        </smy-site-icon>
      </smy-site-button>
    </div>
    <div ref="code" :class="{ 'smy-site-code-example--scroller': disabledFold }" :style="{
      height: height >= 0 ? `${height}px` : undefined,
    }" class="smy-site-code-example__code">
      <slot />
    </div>
  </div>
</template>

<script>
import config from '@config'
import { get } from 'lodash-es'
import { handleCopy } from './utils'
import Copy from "@smy-h5/icons/dist/es/Copy"
import Xml from "@smy-h5/icons/dist/es/Xml"
import SmySiteIcon from '../../../components/icon'

function doubleRaf () {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve)
    })
  })
}

const offset = 10

export default {
  name: 'SmySiteCodeExample',
  components: {
    Copy,
    Xml,
    SmySiteIcon
  },
  data: () => ({
    clipboard: get(config, 'pc.clipboard', true),
    fold: get(config, 'pc.fold'),
    height: -1,
    disabledFold: false,
  }),
  mounted () {
    const { offsetHeight } = this.$refs.code
    const { height, default: defaultFold } = this.fold

    this.disabledFold = offsetHeight - height < offset
    this.height = defaultFold ? height : -1
  },
  methods: {
    async handleToggle () {
      const { height: foldHeight } = this.fold
      if (this.height === foldHeight) {
        this.height = -1
        await this.$nextTick()
        const { offsetHeight } = this.$refs.code
        this.height = foldHeight
        await doubleRaf()
        this.height = offsetHeight
      } else {
        const { offsetHeight } = this.$refs.code
        this.height = offsetHeight
        await doubleRaf()
        this.height = foldHeight
      }
    },
    handleCopy () {
      const res = handleCopy(this.$refs.code.innerText)
      res && alert('复制成功')
    }
  }
}
</script>

<style lang="less">
@import "./codeExample.less";
</style>
