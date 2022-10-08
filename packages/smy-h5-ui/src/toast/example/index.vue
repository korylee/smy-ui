<template>
  <div class="smy-toast-example">
    <div>
      <div>组件调用</div>
      <button @click="changeValue('basic')">基础使用</button>
      <button @click="changeValue('bottom')">底部展示</button>
    </div>

    <div>
      <div>函数调用</div>
      <button @click="createToast()">基础使用</button>
      <button @click="createToast('time')">显示时长</button>
      <button @click="createToast('position')">底部显示</button>
    </div>

    <div>
      <div>Toast 类型</div>
      <button @click="create('loading')">loading 加载中</button>
    </div>
    <div>
      <Toast :show.sync="shows.basic">{{ content }} </Toast>
      <Toast :show.sync="shows.bottom" position="bottom"> {{ content }} </Toast>
    </div>
  </div>
</template>

<script>
import Toast from '../index'

export default {
  name: 'ToastExample',
  components: { Toast: Toast.Component },
  data: () => ({
    shows: {
      basic: false,
      bottom: false,
    },
    content: '这是一个消息条！！',
  }),
  watch: {
    shows: undefined,
  },
  methods: {
    changeValue(type) {
      this.shows[type] = !this.shows[type]
    },
    createToast(type) {
      const { content } = this
      switch (type) {
        case 'time': {
          return Toast({
            content,
            duration: 1000,
          })
        }
        case 'position': {
          return Toast({
            content,
            position: 'bottom',
          })
        }
        default: {
          return Toast(content)
        }
      }
    },
    create(type) {
      const text = type === 'loading' ? '加载中...' : this.content
      Toast[type](text)
    },
  },
}
</script>

<style lang="less" scoped></style>
