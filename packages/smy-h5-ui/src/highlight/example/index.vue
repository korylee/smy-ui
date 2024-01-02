<template>
  <div>
    <smy-highlight content="safasdfad《水水水水》sfasd" :keywords="/《(.*?)》/g">
      <template #highlight="{ text }">
        <span style="color: red">{{ text }}</span>
      </template>
    </smy-highlight>
  </div>
</template>

<script>
import SmyHighlight from '..'

export default {
  name: 'HighlightExample',
  components: { SmyHighlight },
}
</script>
