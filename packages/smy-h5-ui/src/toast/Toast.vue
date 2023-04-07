<template>
  <smy-teleport :to="teleport" :disabled="teleportDisabled">
    <transition name="smy-toast-fade" @after-enter="$emit('opened')" @after-leave="$emit('closed')">
      <toast-core v-show="show" v-bind="$props" class="smy-toast-transition" v-on="$listeners">
        <slot></slot>
        <template #action>
          <slot name="action" />
        </template>
      </toast-core>
    </transition>
  </smy-teleport>
</template>

<script>
import SmyTeleport from '../teleport'
import { teleportMixin } from '../_mixins/teleport'
import { props } from './props'
import ToastCore from './ToastCore.vue'

export default {
  name: 'SmyToast',
  mixins: [teleportMixin],
  components: { SmyTeleport, ToastCore },
  props,
}
</script>
