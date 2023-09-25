<script>
import Monaco from './monaco/Monaco.vue'

export default {
  functional: true,
  props: Monaco.props,
  render(h, { props, listeners }) {
    return h(Monaco, {
      props,
      on: listeners,
    })
  },
}
</script>
