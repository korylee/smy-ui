<template>
  <div>
    <button @click="basicShow = true">基础</button>
    <button @click="multipShow = true">多数</button>
    <Picker :show.sync="basicShow" :columns="[column]" @cancel="basicShow = false" />
    <Picker :show.sync="multipShow" :columns="[column, column]" @cancel="basicShow = false" />
  </div>
</template>

<script>
import Picker from '../'

export default {
  name: 'PickerExample',
  components: { Picker },
  data: () => ({
    basicShow: false,
    multipShow: false,
    column: Array.from({ length: 20 }, (_, index) => index),
  }),
}
</script>

<style></style>
