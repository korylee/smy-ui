<script>
// lib
import VueCodeMirror from './VueCodeMirror.vue'
import './codemirror'

// export
export default {
  name: 'codemirror',
  functional: true,
  props: {
    mode: { type: [String, Object], default: 'htmlmixed' },
    value: { type: String, default: '' },
    readonly: Boolean,
  },
  render(h, { props, listeners }) {
    const { readonly, mode, value } = props
    const addOptions = readonly
      ? {}
      : {
          autoCloseBrackets: true,
          autoCloseTags: true,
          foldGutter: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          keyMap: 'sublime',
        }
    const options = {
      mode,
      readOnly: readonly,
      tabSize: 2,
      lineWrapping: true,
      lineNumbers: true,
      ...addOptions,
    }
    return h(VueCodeMirror, {
      props: {
        options,
        value,
      },
      on: listeners,
    })
  },
}
</script>
