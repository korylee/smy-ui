<template>
  <div>
    <smy-action-sheet :show.sync="show" :items="items" desc="fsfafsd" />
    <button @click="openActionSheet">test</button>
  </div>
</template>

<script>
import ActionSheet from '..'

export default {
  name: 'ActionSheet',
  components: {
    SmyActionSheet: ActionSheet.Component,
  },
  data: () => ({
    show: true,
    items: [{ name: 'test1', loading: true }, { name: 'test2' }],
  }),
  methods: {
    openActionSheet() {
      ActionSheet({ items: this.items, cancelText: '取消' }).then((res) => {
        console.log('----test', res)
      })
    },
  },
}
</script>
