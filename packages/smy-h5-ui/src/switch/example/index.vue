<template>
  <div>
    <SmySwitch :active.sync="active" label="开|关" />
  </div>
</template>

<script>
import SmySwitch from '../Switch.vue'

export default {
  name: 'SwitchExample',
  components: { SmySwitch },
  data: () => ({
    active: false,
  }),
}
</script>

<style></style>
