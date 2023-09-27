<template>
  <div class="teleport-example">
    <teleport to="body">
      <button>in</button>
    </teleport>
  </div>
</template>

<script>
import Teleport from '..'

export default {
  name: 'TeleportExample',
  components: { Teleport },
}
</script>
