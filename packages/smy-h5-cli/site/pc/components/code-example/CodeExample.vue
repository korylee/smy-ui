<template>
  <div class="smy-site-code-example">
    <div class="smy-site-code-example__toolbar">
      <smy-site-button v-if="fold && !disabledFold" @click="handleToggle" text round>
        <smy-site-icon size="18">
          <Xml />
        </smy-site-icon>
      </smy-site-button>
      <smy-site-button v-if="playground" text round @click="toPlayground">
        <smy-site-icon size="18">
          <CodeJson />
        </smy-site-icon>
      </smy-site-button>
      <smy-site-button v-if="clipboard" text round @click="handleCopy">
        <smy-site-icon size="18">
          <Copy />
        </smy-site-icon>
      </smy-site-button>
    </div>
    <!-- <span v-if="lang" class="smy-site-code-example__lang">{{ lang }}</span> -->
    <div ref="code" :class="codeClass" :style="codeStyle" class="smy-site-code-example__code" v-html="output" />
  </div>
</template>

<script>
import config from '@config'
import { genHighlighter, handleCopy } from './utils'
import Copy from '@smy-h5/icons/dist/es/Copy'
import Xml from '@smy-h5/icons/dist/es/Xml'
import CodeJson from '@smy-h5/icons/dist/es/CodeJson'
import SmySiteIcon from '../../../components/icon'
import { doubleRaf } from '@smy-h5/shared'

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
  },
  props: {
    playgroundIgnore: Boolean,
    lang: String,
    code: {
      type: String,
      default: '',
    },
    trim: {
      type: Boolean,
      default: true,
    },
    uri: Boolean,
  },
  data: () => ({
    clipboard: config?.pc?.clipboard ?? true,
    fold: config?.pc?.fold,
    height: -1,
    disabledFold: false,
    output: '<pre></pre>',
    loading: false,
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
  async created() {
    const self = this
    const highligher = await genHighlighter()

    this.$watch('code', run, { immediate: true })
    this.$watch(
      () => [this.lang],
      async () => {
        this.loading = true
        await Promise.all([highligher.loadLanguage(this.lang)])
        run()
      },
      { immediate: true },
    )
    function run() {
      let code = self.code
      if (self.uri) {
        code = window.decodeURIComponent(self.code)
      }
      if (self.trim) {
        code = code.trim()
      }
      self.output = highligher.codeToHtml(code, {
        lang: self.lang,
        theme: 'catppuccin-latte',
        transformers: [
          {
            preprocess(code) {
              if (code.endsWith('\n')) return `${code}\n`
            },
          },
        ],
      })
    }
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
.smy-site-code-example {
  margin-top: 16px;
  margin-bottom: 4px;
  position: relative;
  border-radius: 4px;
  border: thin solid var(--site-config-hl-border);
  transition: border 0.25s;

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
    transition: 0.25s all;

    .smy-site-button {
      color: #58727e;
    }
  }

  &__code {
    transition: all 0.25s;
    overflow: hidden;
    border-radius: 4px;

    &--singleline {
      .smy-site-code {
        white-space: nowrap;
      }
    }

    &--scrollable {
      max-height: 600px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 8px;
        height: 1px;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgb(0 0 0 / 20%);
        background: #888;
      }

      &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgb(0 0 0 / 20%);
        border-radius: 10px;
        background: #ffffff;
      }
    }
    code {
      font-size: var(--site-config-code-font-size);
      padding: 0 24px;
      display: block;
      width: fit-content;
      min-width: 100%;
      transition: color 0.5s;
      border-radius: 8px;
    }
    pre {
      position: relative;
      padding: 20px 0;
      margin: 0;
      background: transparent;
      overflow-x: auto;
    }
  }
  &__lang {
    position: absolute;
    top: 2px;
    right: 8px;
    z-index: 2;
    font-size: 12px;
    font-weight: 500;
    color: #888;
    transition:
      color 0.4s,
      opacity 0.4s;
  }
}
</style>
