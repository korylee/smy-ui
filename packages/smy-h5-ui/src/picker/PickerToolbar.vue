<template>
  <div :class="bem('toolbar')">
    <slot name="toolbar">
      <span :class="bem('cancel')" smy-picker-cover @click="$emit('cancel', $event)">
        <slot name="cancel">{{ cancelButtonText }}</slot>
      </span>

      <div :class="bem('title')">
        <slot name="title">{{ title }}</slot>
      </div>

      <span :class="bem('confirm')" smy-picker-cover @click="$emit('confirm', $event)">
        <slot name="confirm">{{ confirmButtonText }}</slot>
      </span>
    </slot>
  </div>
</template>

<script>
import { bem, name } from './utils'
import { pickerToolbarProps } from './props'

export default {
  name: name + '-tollbar',
  props: pickerToolbarProps,
  methods: {
    bem,
  },
}
</script>
