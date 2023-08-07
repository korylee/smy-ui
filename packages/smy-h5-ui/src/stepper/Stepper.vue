<template>
  <div
    :style="{
      width: convertToUnit(width),
      height: convertToUnit(height),
    }"
    :class="bem()"
  >
    <div
      :style="buttonStyle"
      :class="bem('button', { disabled: !minusable })"
      @click.prevent="onPlusOrMinus('minus', $event)"
      @touchstart.passive="onTouchStart('minus', $event)"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <slot name="minus">
        <smy-icon><minus /></smy-icon>
      </slot>
    </div>
    <input
      :value="internalValue"
      :min="min"
      :max="max"
      :readonly="readonly || !isLegal"
      :disabled="disabled || !isLegal"
      :class="bem('input')"
      v-bind="$attrs"
      type="number"
      @input="onInput"
      @keyup="$emit('keyup', $event)"
      @focus="$emit('focus', $event)"
      @blur="onBlur"
    />
    <div
      :class="bem('button', { disabled: !plusable })"
      :style="buttonStyle"
      @click.prevent="onPlusOrMinus('plus', $event)"
      @touchstart.passive="onTouchStart('plus', $event)"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <slot name="plus">
        <smy-icon><plus /></smy-icon>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { props } from './props'
import Plus from '@smy-h5/icons/dist/es/Plus'
import Minus from '@smy-h5/icons/dist/es/Minus'
import SmyIcon from '../icon'
import { range, toNumber } from '../_utils/shared'
import { throwError } from '../_utils/smy/warn'
import { convertToUnit } from '../_utils/dom'
import { createNamespace } from '../_utils/vue/create'
import { computed, defineComponent, nextTick, watch } from 'vue'
import { useProxiedModel } from '../composables/useProxiedModel'
import { Numeric } from '../_utils/is'

const [name, bem] = createNamespace('stepper')

type ActionType = 'minus' | 'plus'
const isEqual = (value1?: Numeric, value2?: Numeric) => String(value1) === String(value2)
const LONG_PRESS_SPEED = 200

export default defineComponent({
  name,
  props,
  emits: ['update:modelValue', 'change', 'keyup', 'plus', 'minus', 'blur', 'focus', 'overlimit'],
  components: { Plus, Minus, SmyIcon },
  setup(props, { emit }) {
    const normalizeValue = (value: string | number) => {
      const { decimalPlaces, min, max } = props
      return toNumber(toNumber(range(toNumber(value) || +min, +min, +max)).toFixed(+decimalPlaces))
    }
    const internalValue = useProxiedModel(props, 'modelValue', {
      transformOut: normalizeValue,
      defaultValue: props.defaultValue,
    })
    const minusable = computed(
      () => internalValue.value - toNumber(props.step) >= +props.min && !props.disabledMinus && !props.disabled
    )
    const plusable = computed(
      () => internalValue.value + toNumber(props.step) <= +props.max && !props.disabledPlus && !props.disabled
    )
    const isLegal = computed(() => props.min < props.max && +props.min >= 0)
    const buttonStyle = computed(() => ({
      width: convertToUnit(props.buttonWidth),
      fontSize: convertToUnit(props.buttonSize),
    }))

    if (!isEqual(internalValue.value, props.modelValue)) {
      emit('update:modelValue', internalValue.value)
    }

    watch(isLegal, (val) => {
      !val && throwError(name, `max必须大于min!`)
    })

    const onPlusOrMinus = (actionType: ActionType, event: Event) => {
      if ((actionType === 'minus' && !minusable.value) || (actionType === 'plus' && !plusable.value)) {
        emit('overlimit', actionType)
        return
      }
      const diff = (actionType === 'minus' ? -1 : 1) * toNumber(props.step)

      internalValue.value += diff
      emit(actionType, event)
    }
    const onInput = (event: Event) => {
      const target = event.target as HTMLInputElement
      const { value } = target

      let formatted: string | number = parseFloat(String(value))
      formatted = formatted.toFixed(toNumber(props.decimalPlaces))
      target.value = formatted
      emit('change', event)
    }
    const onBlur = (event: InputEvent) => {
      const target = event.target as unknown as HTMLInputElement
      internalValue.value = target.value
      nextTick(() => {
        target.value = String(internalValue.value)
        emit('blur', event)
      })
    }
    let isLongPress = false
    let longPressTimer: ReturnType<typeof setTimeout>
    const onTouchStart = (actionType: ActionType, event: Event) => {
      if (!props.longPress) return
      const longPressStep = () => {
        longPressTimer = setTimeout(() => {
          isLongPress = true
          onPlusOrMinus(actionType, event)
          longPressStep()
        }, LONG_PRESS_SPEED)
      }

      isLongPress = false
      clearTimeout(longPressTimer)
      longPressStep()
    }
    const onTouchEnd = (event: TouchEvent) => {
      if (!props.longPress) return
      clearTimeout(longPressTimer)
      isLongPress && event.preventDefault()
    }
    return {
      internalValue,
      minusable,
      plusable,
      isLegal,
      buttonStyle,
      bem,
      convertToUnit,
      onPlusOrMinus,
      onInput,
      onBlur,
      onTouchStart,
      onTouchEnd,
    }
  },
})
</script>

<style lang="less">
@import './stepper.less';
</style>
