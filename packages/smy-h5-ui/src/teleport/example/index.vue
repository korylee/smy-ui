<template>
  <div class="teleport-example">
    <Teleport to="body">
      <button>in</button>
    </Teleport>
  </div>
</template>

<script>
import Teleport from '..'

export default {
  name: 'TeleportExample',
  components: { Teleport },
}
</script>
