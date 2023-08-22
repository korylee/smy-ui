<template>
  <div :class="bem()">
    <div :class="bem('body')">
      <component
        :is="type === 'textarea' ? 'textarea' : 'input'"
        ref="input"
        v-bind="{
          ...mapInputType(type),
          name,
          placeholder,
          rows,
          disabled,
          readonly,
        }"
        :class="bem('control')"
        @input="onInput"
        @click="$emit('click-input', $event)"
        @blur="onBlur"
        @focus="onFocus"
        @change="onEndComposing"
        @compositionend="onEndComposing"
        @compositionstart="onStartComposing"
      />
      <smy-icon :class="bem('clear')" />
      <div :class="bem('right-icon')">
        <slot name="right-icon">
          <smy-icon></smy-icon>
        </slot>
      </div>
    </div>
    <div v-if="showWordLimit && maxlength" :class="bem('word-limit')">
      <span :class="bem('word-num')">{{ count }}</span
      >/{{ maxlength }}
    </div>
  </div>
</template>

<script>
import { createNamespace } from '../_utils/vue/create'
import { props } from './props'
import { getStringLength, cutString, resizeTextarea } from './utils'
import SmyIcon from '../icon'
import { formatNumber } from '../_utils/shared'
import { resetScroll } from '../_utils/dom'

const [name, bem] = createNamespace('field')

function mapInputType(type) {
  if (type === 'textarea') {
    return
  }

  if (type === 'number') {
    return {
      type: 'text',
      inputmode: 'decimal',
    }
  }
  if (type === 'digit') {
    return {
      type: 'tel',
      inputmode: 'numeric',
    }
  }
  return { type }
}

export default {
  name,
  components: { SmyIcon },
  props,
  data: () => ({
    focused: false,
  }),
  computed: {
    count() {
      return getStringLength(String(this.value || ''))
    },
  },
  watch: {
    value() {
      this.updateValue(String(this.value || ''))
      this.$nextTick(this.adjustTextareaSize)
    },
  },
  mounted() {
    this.updateValue(String(this.value || ''))
    this.$nextTick(this.adjustTextareaSize)
  },
  methods: {
    bem,
    mapInputType,
    limitValueLength(value) {
      const { maxlength, focused } = this
      const { input } = this.$refs
      if (maxlength == null || getStringLength(value) <= +maxlength) {
        return value
      }
      const modelValue = String(this.value || '')
      if (modelValue && getStringLength(modelValue) === +maxlength) {
        return modelValue
      }
      const selectionEnd = input ? input.selectionEnd : undefined
      if (focused && selectionEnd) {
        const valueArr = [...value]
        const exceededLength = valueArr.length - +maxlength
        valueArr.splice(selectionEnd - exceededLength, exceededLength)
        return valueArr.join('')
      }
      return cutString(value, +maxlength)
    },
    updateValue(value) {
      const originalValue = value
      value = this.limitValueLength(value)
      const { type } = this
      const { input } = this.$refs

      const limitDiffLen = getStringLength(originalValue) - getStringLength(value)
      if (['number', 'digit'].includes(type)) {
        const isNumber = type === 'number'
        value = formatNumber(value, isNumber)
      }
      if (input && input.value !== value) {
        if (this.focused) {
          let { selectionStart, selectionEnd } = input
          input.value = value
          if (selectionStart != null && selectionEnd != null) {
            const valueLen = getStringLength(value)
            if (limitDiffLen) {
              selectionStart -= limitDiffLen
              selectionEnd -= limitDiffLen
            }
            input.setSelectionRange(Math.min(selectionStart, valueLen), Math.min(selectionEnd, valueLen))
          }
        } else {
          input.value = value
        }
      }
      if (value !== this.value) {
        this.$emit('input', value)
      }
    },
    onBlur(event) {
      this.focused = false
      this.updateValue(String(this.value || ''))
      this.$emit('blur', event)
      resetScroll()
    },
    onInput(event) {
      const { target } = event
      if (target.composing) return
      this.updateValue(target.value)
    },
    onFocus(event) {
      this.focused = true
      this.$emit('focus', event)
      this.$nextTick(this.adjustTextareaSize)
      if (this.readonly) {
        const { input } = this.$refs
        input && input.blur()
      }
    },
    onStartComposing(event) {
      event.target.composing = true
    },
    onEndComposing(event) {
      const { target } = event
      if (!target.composing) return
      target.composing = false
      target.dispatchEvent(new Event('input'))
    },
    adjustTextareaSize() {
      const { type, autosize } = this
      const { input } = this.$refs
      if (type !== 'textarea' || !input || !autosize) return
      resizeTextarea(input, autosize)
    },
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
@import '../icon/icon.less';
@import './field.less';
</style>
