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
          autocomplete,
          autocapitalize,
          autocorrect,
          enterkeyhint,
          spellcheck,
          autofocus,
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
      <smy-icon
        v-if="!readonly && clearable"
        v-show="showClear"
        :class="bem('clear')"
        :name="clearIcon"
        @click.stop="onClear"
      />
      <div v-if="$scopedSlots['button']" :class="bem('button')"><slot name="button" /></div>
    </div>
    <smy-form-details :error-message="errorMessage || $data._errorMessage" :extra-message="wordLimit">
      <template #error-message><slot name="error-message" /></template>
      <template #extra-message><slot name="word-limit" /></template>
    </smy-form-details>
  </div>
</template>

<script>
import { createNamespace } from '../_utils/vue/create'
import { props } from './props'
import { getStringLength, cutString, resizeTextarea, mapInputType } from './utils'
import SmyIcon from '../icon'
import { formatNumber } from '@smy-h5/shared'
import { resetScroll } from '@smy-h5/shared'
import { createProxiedModel } from '../_mixins/proxiedModel'
import { ValidateProvider, getPropComputed } from '../_mixins/validate'
import SmyFormDetails from '../form-details'
import { emit } from '../_mixins/listeners'

const [name, bem] = createNamespace('field')

export default {
  name,
  components: { SmyIcon, SmyFormDetails },
  mixins: [
    createProxiedModel('value', 'modelValue', {
      // passive: false,
      transformIn: (value) => String(value || ''),
    }),
    ValidateProvider,
  ],
  props,
  data: () => ({
    focused: false,
  }),
  computed: {
    count({ modelValue }) {
      return getStringLength(modelValue)
    },
    showClear({ modelValue, clearTrigger, focused }) {
      const hasValue = modelValue !== ''
      const trigger = clearTrigger === 'always' || (clearTrigger === 'focus' && focused)
      return hasValue && trigger
    },
    getProp: getPropComputed,
    wordLimit({ showWordLimit, count, maxlength }) {
      if (!showWordLimit || !maxlength) {
        return ''
      }
      return `${count}/${maxlength}`
    },
    resetValidate: ({ _reset }) => _reset,
  },
  watch: {
    value: 'init',
  },
  mounted() {
    this.init()
  },
  methods: {
    bem,
    mapInputType,
    init() {
      this.updateValue(this.modelValue)
      this.$nextTick(this.adjustTextareaSize)
    },
    limitValueLength(value) {
      const { maxlength, focused, modelValue } = this
      const { input } = this.$refs
      if (maxlength == null || getStringLength(value) <= +maxlength) {
        return value
      }
      if (modelValue && getStringLength(modelValue) === +maxlength) {
        return modelValue
      }
      const selectionEnd = input ? input.selectionEnd : undefined
      if (focused && selectionEnd) {
        const valueArr = stringToArray(value)
        const exceededLength = valueArr.length - +maxlength
        valueArr.splice(selectionEnd - exceededLength, exceededLength)
        return valueArr.join('')
      }
      return cutString(value, +maxlength)
    },
    updateValue(value) {
      const originalValue = value
      value = this.limitValueLength(value)
      const { type, formatter, focused, maxlength } = this
      const { input } = this.$refs

      const limitDiffLen = getStringLength(originalValue) - getStringLength(value)
      if (['number', 'digit'].includes(type)) {
        const isNumber = type === 'number'
        value = formatNumber(value, isNumber, isNumber)
      }

      let formatterDiffLen = 0
      if (formatter) {
        value = formatter(value)
        if (maxlength != null && getStringLength(value) > +maxlength) {
          value = cutString(value, +maxlength)
        }

        if (input && focused) {
          const { selectionEnd } = input
          const bcoVal = cutString(originalValue, selectionEnd)
          formatterDiffLen = getStringLength(formatter(bcoVal)) - getStringLength(bcoVal)
        }
      }

      if (input && input.value !== value) {
        if (focused) {
          let { selectionStart, selectionEnd } = input
          input.value = value
          if (selectionStart != null && selectionEnd != null) {
            const valueLen = getStringLength(value)
            if (limitDiffLen) {
              selectionStart -= limitDiffLen
              selectionEnd -= limitDiffLen
            } else if (formatterDiffLen) {
              selectionStart += formatterDiffLen
              selectionEnd += formatterDiffLen
            }
            input.setSelectionRange(Math.min(selectionStart, valueLen), Math.min(selectionEnd, valueLen))
          }
        } else {
          input.value = value
        }
      }
      if (value !== this.value) {
        this.modelValue = value
      }
    },
    onBlur(event) {
      this.focused = false
      this.updateValue(this.modelValue)
      this.$emit('blur', event)
      if (this.readonly) {
        return
      }
      this.$nextTick(this.adjustTextareaSize)
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
    onClear(event) {
      this.modelValue = ''
      this.$emit('clear', event)
    },
    adjustTextareaSize() {
      const { type, autosize } = this
      const { input } = this.$refs
      if (type !== 'textarea' || !input || !autosize) return
      resizeTextarea(input, autosize)
    },
    validate() {
      this._reset()
      emit(this, 'start-validate')
      return this._validate(this.modelValue).then(() => {
        const { _status, _errorMessage, name } = this
        emit(this, 'end-validate')
        return _status === 'failed' ? { name, message: _errorMessage } : undefined
      })
    },
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
@import '../icon/icon.less';
@import './field.less';
</style>
