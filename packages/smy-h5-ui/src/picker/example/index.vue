<template>
  <div>
    <button @click="basicShow = true">基础</button>
    <Picker :show.sync="basicShow" :columns="columns" @cancel="basicShow = false" />
  </div>
</template>

<script>
import Picker from '../'

export default {
  name: 'PickerExample',
  components: { Picker },
  data: () => ({
    basicShow: false,
    columns: [Array.from({ length: 20 }, (_, index) => index)],
  }),
}
</script>

<style></style>
