<script>
import CodeMirror from './codemirror/CodeMirror.vue'

const props = {
  value: String,
  filename: String,
  readonly: Boolean,
  mode: {
    type: [String, Object], // 'js' | 'css' | object
  },
}

const modes = {
  css: 'css',
  html: 'htmlmixed',
  js: {
    name: 'javascript',
  },
  json: {
    name: 'javascript',
    json: true,
  },
  ts: {
    name: 'javascript',
    typescript: true,
  },
  vue: 'htmlmixed',
}

export default {
  functional: true,
  props,
  render(h, { props, listeners }) {
    const { mode: forceMode, filename, value, readonly } = props
    const mode = modes[forceMode || filename.split('.').pop()]
    const activeMode = filename.lastIndexOf('.') !== -1 && mode ? mode : modes.js
    return h(CodeMirror, {
      on: listeners,
      props: {
        value,
        mode: activeMode,
        readonly,
      },
    })
  },
}
</script>
