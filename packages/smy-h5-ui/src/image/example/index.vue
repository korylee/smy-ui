<template>
  <div>
    <smy-image v-for="item of 66" :key="item" lazy src="https://korylee.github.io/blog/avatar.png" />
  </div>
</template>
<script>
import SmyImage from '..'

export default {
  name: 'ImageExample',
  components: { SmyImage },
}
</script>
