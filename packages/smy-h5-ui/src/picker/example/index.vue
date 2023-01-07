<template>
  <div>
    <button @click="basicShow = true">基础</button>
    <button @click="multipShow = true">多数</button>
    <smy-picker :show.sync="basicShow" :columns="[column]" @cancel="basicShow = false" />
    <smy-picker :show.sync="multipShow" :columns="[column, column]" @cancel="basicShow = false" />
  </div>
</template>

<script>
import Picker from '../'

export default {
  name: 'PickerExample',
  components: { SmyPicker: Picker.Component },
  data: () => ({
    basicShow: false,
    multipShow: false,
    column: Array.from({ length: 20 }, (_, index) => index),
  }),
}
</script>

<style></style>
