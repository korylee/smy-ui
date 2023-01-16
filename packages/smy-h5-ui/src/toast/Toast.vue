<template>
  <Teleport :to="teleport" :disabled="teleportDisabled">
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
import { teleportMixin } from '../_context/mixins/teleport'
import { props } from './props'
import ToastCore from './ToastCore.vue'

export default {
  name: 'SmyToast',
  mixins: [teleportMixin],
  components: { Teleport, ToastCore },
  props,
}
</script>
