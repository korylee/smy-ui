<template>
  <div>
    <smy-uploader v-model="basic" preview-image max-count="3" />
  </div>
</template>

<script>
import SmyUploader from '../Uploader.vue'

export default {
  name: 'UploaderExample',
  components: { SmyUploader },
  data: () => ({
    basic: [],
  }),
}
</script>
