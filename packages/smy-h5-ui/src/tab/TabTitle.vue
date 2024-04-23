<template>
  <div
    role="tab"
    :class="bem({ active, grow: scrollable && !shrink, shrink, disabled })"
    :style="style"
    :tabindex="disabled ? undefined : active ? 0 : -1"
    :aria-selected="active"
    :aria-disabled="disabled || undefined"
    :aria-controls="controls"
    v-on="$listeners"
  >
    <maybe-badge :maybe="!!badge || badge == 0" :value="badge">
      <span :class="bem('text')">
        <slot>{{ title }}</slot>
      </span></maybe-badge
    >
  </div>
</template>

<script>
import { createMaybeComponent } from '../_utils/vue/component'
import SmyBadge from '../badge'
import { numericProp } from '../_utils/vue/props'
import { name, bem } from './utils'
import { defineComponent, computed } from 'vue'

const MaybeBadge = createMaybeComponent(SmyBadge)

export default defineComponent({
  name: name + '-title',
  props: {
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
  setup(props) {
    const style = computed(() => {
      const _style = {}
      const { color, disabled, active } = props
      if (color) {
        _style.borderColor = color
        if (!disabled) {
          if (active) {
            _style.backgroundColor = color
          } else {
            _style.color = color
          }
        }
      }
      return _style
    })
    return {
      style,
      bem,
    }
  },
})
</script>
