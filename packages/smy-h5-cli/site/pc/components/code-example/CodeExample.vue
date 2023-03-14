<template>
  <div class="smy-site-code-example">
    <div class="smy-site-code-example__toolbar">
      <button v-if="fold && !disabledFold" @click="handleToggle" style="width: 18px; height: 18px;">fo</button>
      <img
          v-if="clipboard"
          style="width: 18px; height: 18px;"
          src="https://img10.360buyimg.com/imagetools/jfs/t1/142615/10/25537/3671/61c31e6eE3ba7fb90/d1953e2b47e40e86.png"
          @click="handleCopy"
      />
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
import {handleCopy} from './utils'

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
  data: () => ({
    clipboard: get(config, 'pc.clipboard', true),
    fold: get(config, 'pc.fold'),
    height: -1,
    disabledFold: false,
  }),
  mounted () {
    const { offsetHeight } = this.$refs.code
    const {height, default: defaultFold} = this.fold

    this.disabledFold = offsetHeight - height < offset
    this.height = defaultFold ? height : -1
  },
  methods: {
    async handleToggle () {
      const {height: foldHeight} = this.fold
      if (this.height === foldHeight) {
        this.height = -1
        await this.$nextTick()
        const {offsetHeight} = this.$refs.code
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
    handleCopy(){
      const res = handleCopy(this.$refs.code.innerText)
      res && alert('复制成功')
    }
  }
}
</script>

<style lang="less">
.smy-site-code-example {
  margin-top: 16px;
  margin-bottom: 4px;
  position: relative;
  border-radius: 4px;
  border: thin solid var(--site-config-color-hl-border);
  transition: border .25s;

  &:hover {
    .smy-site-code-example__toolbar {
      opacity: 1;
    }
  }

  &__toolbar {
    display: flex;
    align-items: center;
    position: absolute;
    z-index: 1;
    right: 10px;
    top: 10px;
    opacity: 0;
    transition: .25s all;

    button {
      color: var(--site-config-color-hl-code) !important;
    }
  }

  &__code {
    transition: all .25s;
    overflow: hidden;
    border-radius: 4px;
  }

  &--scroller {
    code {
      white-space: nowrap;
    }
  }
}
</style>
