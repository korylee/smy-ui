<template>
  <div class="smy-toast-example">
    <div>
      <app-demo-title>组件调用</app-demo-title>
      <button @click="changeValue('basic')">基础使用</button>
      <button @click="changeValue('bottom')">底部展示</button>
    </div>

    <div>
      <app-demo-title>函数调用</app-demo-title>
      <button @click="createToast()">基础使用</button>
      <button @click="createToast('position')">底部显示</button>
      <button @click="createToast('loading')">加载中</button>
      <button @click="createToast('time')">倒计时</button>
    </div>

    <div>
      <app-demo-title>Toast 类型</app-demo-title>
      <button @click="handleToast">不指定类型</button>
      <button @click="create('loading')">loading 加载中</button>
    </div>
    <div>
      <app-demo-title>旧smy 风格</app-demo-title>
      <button @click="smyLoading">smy loading</button>
      <button @click="smyToast">smy toast</button>
    </div>
    <div>
      <smy-toast :show.sync="shows.basic">{{ content }} </smy-toast>
      <smy-toast :show.sync="shows.bottom" position="bottom"> {{ content }} </smy-toast>
    </div>
  </div>
</template>

<script>
import Toast from '..'
import { AppDemoTitle } from '@smy-h5/cli/client'
import SMY_LOADING_IMG from './smyLoading'

export default {
  name: 'ToastExample',
  components: { SmyToast: Toast.Component, AppDemoTitle },
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
        case 'position': {
          return Toast({
            content,
            duration: 3000,
            position: 'bottom',
          })
        }
        case 'loading': {
          return Toast({
            type: 'loading',
            duration: 3000,
            content,
          })
        }
        case 'time': {
          let time = 3
          const getContent = () => '倒计时' + time + 's'
          const timerId = setInterval(() => {
            time--
            instance.content = getContent()
          }, 1000)
          const instance = Toast({
            type: 'loading',
            content: getContent(),
            duration: 3000,
            onClosed() {
              clearInterval(timerId)
            },
          })
          return
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
    smyLoading() {
      Toast.loading({
        icon: SMY_LOADING_IMG,
        duration: 3000,
        iconSize: 50,
        position: 'center',
      })
    },
    smyToast() {
      Toast({
        vertical: true,
        position: 'center',
        content: '这是一个超长的描述',
        duration: 2500,
      })
    },
    handleToast() {
      Toast('这里是toast')
    },
  },
}
</script>

<style lang="less" scoped></style>
