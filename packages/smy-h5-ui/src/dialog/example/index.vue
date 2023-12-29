<template>
  <div>
    <button @click="onClick">测试</button>
  </div>
</template>

<script>
import Dialog from '..'

export default {
  name: 'DialogExample',
  components: {
    SmyDialog: Dialog.Component,
  },
  methods: {
    onClick() {
      Dialog({
        title: '测试',
        content: '发的发',
        confirmText: '确认',
      })
    },
  },
}
</script>
