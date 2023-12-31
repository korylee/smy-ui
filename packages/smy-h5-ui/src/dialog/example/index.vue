<template>
  <div>
    <app-demo-title>基础使用</app-demo-title>
    <basic-example />
  </div>
</template>

<script>
import { Dialog } from '@smy-h5/ui'
import { AppDemoTitle } from '@smy-h5/cli/client'
import BasicExample from './BasicExample.vue'

export default {
  name: 'DialogExample',
  components: {
    SmyDialog: Dialog.Component,
    AppDemoTitle,
    BasicExample,
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
