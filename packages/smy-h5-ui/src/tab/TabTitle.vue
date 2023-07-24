<template>
  <div
    role="tab"
    :class="bem({ active })"
    :style="style"
    :tabindex="disabled ? undefined : active ? 0 : -1"
    :aria-selected="active"
    :aria-disabled="disabled || undefined"
    :aria-controls="controls"
    v-on="$listeners"
  >
    <maybe-badge :maybe="dot || badge || badge == 0" :dot="dot" :value="badge">
      <span :class="bem('text')">
        <slot name="title">{{ title }}</slot>
      </span></maybe-badge
    >
  </div>
</template>

<script>
import { createNamespace } from '../_utils/vue/create'
import { createMaybeComponent } from '../_utils/vue/component'
import SmyBadge from '../badge'
import { numericProp } from '../_utils/vue/props'

const MaybeBadge = createMaybeComponent(SmyBadge)
const [name, bem] = createNamespace('tab')

export default {
  name: name + '-title',
  props: {
    dot: Boolean,
    type: String,
    color: String,
    title: String,
    badge: numericProp,
    shrink: Boolean,
    active: Boolean,
    disabled: Boolean,
    controls: String,
    scrollable: Boolean,
    activeColor: String,
    inactiveColor: String,
  },
  components: { MaybeBadge },
  computed: {
    style() {
      const style = {}
      const { color, disabled, active } = this
      if (color) {
        style.borderColor = color
        if (!disabled) {
          if (active) {
            style.backgroundColor = color
          } else {
            style.color = color
          }
        }
      }
      return style
    },
  },
  methods: {
    bem,
  },
}
</script>
