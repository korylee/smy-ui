<template>
  <code ref="codeRef" class="smy-site-code">
    <slot />
  </code>
</template>
<script>
import hljs from 'highlight.js'

export default {
  name: 'SmySiteCode',
  props: {
    language: String,
    code: {
      type: String,
      default: '',
    },
    trim: {
      type: Boolean,
      default: true,
    },
    uri: Boolean,
    inline: Boolean,
  },
  watch: {
    language: 'setCode',
    code: 'setCode',
  },
  mounted() {
    this.$nextTick(this.setCode)
  },
  methods: {
    setCode() {
      if (this.$slots.default) return
      const { codeRef: codeEl } = this.$refs
      if (!codeEl) return
      const { language } = this
      const code = this.uri ? window.decodeURIComponent(this.code) : this.code
      if (language) {
        const html = this.createCodeHtml(language, code, this.trim)
        if (html !== null) {
          if (this.inline) {
            codeEl.innerHTML = html
          } else {
            const prevPreEl = codeEl.querySelector('.__code__')
            if (prevPreEl) codeEl.removeChild(prevPreEl)
            const preEl = document.createElement('pre')
            preEl.className = '__code__'
            preEl.innerHTML = html
            codeEl.appendChild(preEl)
          }
          return
        }
      }
      if (this.inline) {
        codeEl.textContent = code
        return
      }
      const maybePreEl = codeEl.querySelector('.__code__')
      if (maybePreEl) {
        maybePreEl.textContent = code
      } else {
        const wrap = document.createElement('pre')
        wrap.className = '__code__'
        wrap.textContent = code
        codeEl.innerHTML = ''
        codeEl.appendChild(wrap)
      }
    },
    createCodeHtml(language, code, trim) {
      if (!language || !hljs.getLanguage(language)) {
        return null
      }
      return hljs.highlight(trim ? code.trim() : code, { language }).value
    },
  },
}
</script>

<style lang="less">
@import './code.less';
</style>
