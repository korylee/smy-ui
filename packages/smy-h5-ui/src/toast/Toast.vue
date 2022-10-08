<template>
  <Teleport :to="teleport">
    <transition name="smy-toast-fade" @after-enter="$emit('opened')" @after-leave="$emit('closed')">
      <ToastCore v-show="show" v-bind="$props" class="smy-toast-transition" v-on="$listeners">
        <slot></slot>
        <template #action>
          <slot name="action" />
        </template>
      </ToastCore>
    </transition>
  </Teleport>
</template>

<script>
import Teleport from '../teleport'
import { props } from './props'
import ToastCore from './ToastCore.vue'

export default {
  name: 'SmyToast',
  components: { Teleport, ToastCore },
  props,
}
</script>
