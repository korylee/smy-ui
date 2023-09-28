<template>
  <div class="smy-site-code-example">
    <div class="smy-site-code-example__toolbar">
      <smy-site-button v-if="fold && !disabledFold" @click="handleToggle" text round>
        <smy-site-icon size="18">
          <Xml />
        </smy-site-icon>
      </smy-site-button>
      <smy-site-button v-if="clipboard" text round @click="handleCopy">
        <smy-site-icon size="18">
          <Copy />
        </smy-site-icon>
      </smy-site-button>
      <smy-site-button v-if="playground" text round @click="toPlayground">
        <smy-site-icon size="18">
          <CodeJson />
        </smy-site-icon>
      </smy-site-button>
    </div>
    <div ref="code" :class="codeClass" :style="codeStyle" class="smy-site-code-example__code">
      <smy-site-code :language="language" :code="code" :trim="trim" :uri="uri" :inline="inline" />
    </div>
  </div>
</template>

<script>
import config from '@config'
import { handleCopy } from './utils'
import Copy from '@smy-h5/icons/dist/es/Copy'
import Xml from '@smy-h5/icons/dist/es/Xml'
import CodeJson from '@smy-h5/icons/dist/es/CodeJson'
import SmySiteIcon from '../../../components/icon'
import SmySiteCode from '../code'

function doubleRaf() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve)
    })
  })
}

function utoa(data) {
  return btoa(unescape(encodeURIComponent(data)))
}

const offset = 10

export default {
  name: 'SmySiteCodeExample',
  components: {
    Copy,
    Xml,
    SmySiteIcon,
    CodeJson,
    SmySiteCode,
  },
  props: { playgroundIgnore: Boolean, ...SmySiteCode.props },
  data: () => ({
    clipboard: config?.pc?.clipboard ?? true,
    fold: config?.pc?.fold,
    height: -1,
    disabledFold: false,
  }),
  computed: {
    codeClass({ disabledFold, fold, height }) {
      return {
        'smy-site-code-example__code--singleline': disabledFold,
        'smy-site-code-example__code--scrollable': fold?.height !== height,
      }
    },
    codeStyle({ height }) {
      return {
        height: height >= 0 ? `${height}px` : undefined,
      }
    },
    playground() {
      return this.playgroundIgnore ? undefined : config?.pc?.header?.playground
    },
  },
  mounted() {
    this.$nextTick(() => {
      const { offsetHeight } = this.$refs.code
      const { height, default: defaultFold } = this.fold

      this.disabledFold = offsetHeight - height < offset
      this.height = defaultFold ? height : -1
    })
  },
  methods: {
    async handleToggle() {
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
    handleCopy() {
      const res = handleCopy(this.$refs.code.innerText)
      res && alert('复制成功')
    },
    toPlayground() {
      const codeText = this.$refs.code?.innerText ?? ''
      const file = { 'App.vue': codeText }
      const url = this.playground + `/#${utoa(JSON.stringify(file))}`
      window.open(url)
    },
  },
}
</script>

<style lang="less">
@import './codeExample.less';
</style>
