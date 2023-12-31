<template>
  <smy-cell-group insert>
    <smy-cell title="提示弹窗" @click="showDialog"></smy-cell>
  </smy-cell-group>
</template>

<script>
import { Cell, CellGroup, Dialog } from '@smy-h5/ui'

export default {
  name: 'BasicExample',
  data: () => ({}),
  components: { SmyCell: Cell, SmyCellGroup: CellGroup },
  methods: {
    showDialog() {
      Dialog({
        title: '提示',
        content: '内容',
        showCancel: true,
        confirmText: '确认',
        cancelText: '取消',
      })
    },
  },
}
</script>

<style lang="less"></style>
