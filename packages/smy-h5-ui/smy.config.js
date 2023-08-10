const { defineConfig } = require('@smy-h5/cli')

module.exports = defineConfig({
  name: 'Smy',
  namespace: 'smy',
  highlight: { style: null },
  useMobile: true,
  port: 8088,
  pc: {
    indexPage: {
      description:
        'Smy-h5 是一个基于Vue2开发的组件库，全面拥抱Vue2生态，由萨摩耶C端团队维护。支持TypeScript、按需引入、主题定制。',
      started: '起步',
      features: [
        {
          name: '组件丰富',
          description: '提供20+个高质量通用组件（增加中）',
        },
        {
          name: '按需引入',
          description: '每一个组件都可单独引入，并有着良好的 tree-shaking 优化',
        },
        {
          name: '主题定制',
          description: '支持组件的样式自定义',
        },
        {
          name: '支持TypeScript',
          description: '使用 Typescript 构建，提供良好的组件类型系统',
        },
        {
          name: 'IDE支持',
          description: '支持在 vscode 中的组件语法高亮',
        },
      ],
    },
    menu: [
      { text: '开发指南', type: 1 },
      { text: '基本介绍', type: 3, doc: 'home' },
      { text: '基础组件', type: 1 },
      // { text: 'ConfigProvider 全局配置', doc: 'config-provider', type: 2 },
      { text: 'Cell 单元格', doc: 'cell', type: 2 },
      // { text: 'Icon 图标', doc: 'icon', type: 2 },
      { text: 'ProgressCircular 圆进度条', doc: 'progress-circular', type: 2 },
      // { text: 'Loading 加载', doc: 'loading', type: 2 },
      // { text: '展示组件', type: 1 },
      // { text: 'Badge 徽标', doc: 'badge', type: 2 },
      // { text: 'Ellipsis 文本省略', doc: 'ellipsis', type: 2 },
      { text: 'Layout 布局', doc: 'row', type: 2 },
      // { text: 'Steps 步骤条', doc: 'steps', type: 2 },
      // { text: 'Swiper 轮播', doc: 'swiper', type: 2 },
      { text: 'Countdown 倒计时', doc: 'countdown', type: 2 },
      // { text: 'Tag 标签', doc: 'tag', type: 2 },
      // { text: 'ImagePreview 图片预览', doc: 'image-preview', type: 2 },
      // { text: 'Lazy 懒加载', type: 2, doc: 'lazy' },
      // { text: 'Image 图片', type: 2, doc: 'image' },
      { text: '导航组件', type: 1 },
      // { text: 'NoticeBar 通告栏', doc: 'notice-bar', type: 2 },
      { text: '功能指令', type: 1 },
      // { text: 'Lazyload 懒加载', type: 2, doc: 'lazyload' },
      // { text: '反馈组件', type: 1 },
      // { text: 'Toast 吐司气泡', doc: 'toast', type: 2 },
      { text: 'Popup 弹出层', doc: 'popup', type: 2 },
      { text: 'Picker 多列选择器', doc: 'picker', type: 2 },
      { text: 'Swipe 滑动手势', doc: 'swipe', type: 2 },
      { text: 'Scroller 滚动加载', doc: 'scroller', type: 2 },
      { text: 'PullRefresh 下拉刷新', doc: 'pull-refresh', type: 2 },
      // { text: '表单组件', type: 1 },
      { text: 'Stepper 步进器', doc: 'stepper', type: 2 },
      // { text: 'Switch 开关', doc: 'switch', type: 2 },
    ],
  },
})
