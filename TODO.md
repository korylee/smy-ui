# bugfix

> 已知的 bug

# feat

> 计划待做的功能

## @smy-h5/cli

### 命令

- [ ] compile (打包组件库)
  - [x] 打包生成 es module 文件格式
  - [ ] 打包生成 commonjs 文件格式
  - [ ] 组件类型文件编译
- [x] dev (本地开发命令)
  - [x] 热更新（修改配置重启，其余更新修改后的文件）
- [ ] lint (代码格式化)
  - [x] 加入 eslint 格式化
  - [x] 加入 prettier 格式化
  - [ ] 加入 stylelint 格式化
- [x] build (打包文档样例网页)
  - [x] 解析文件目录生成 pc 端路由
  - [x] 加入嵌套的 mobile iframe 做预览
  - [x] 解析文件目录生成 mobile 路由
  - [x] 解析 markdown 文件生成 vue 文件
- [ ] preview （预览打包后的组件库文档）
- [x] changlog (生成 commit 日志)
- [ ] test (单元测试)
- [ ] commitLint （commit 美化）

## @smy-h5/ui

> 这里按实际需求来

### 基础组件

[] StyleProvider 样式定制 / ConfigProvider 配置定制
[x] Loading 加载

### 展示组件

[x] Card 卡片
[] Image 图片组件
[ ] ImgPreview 图片预览重构

### 导航组件

[] Tab 选项卡

### 功能指令

[x] lazy 图片懒加载

### 反馈组件

[x] Toast 消息条
[] Dialog 对话框
[] Popup 弹出层
[] ActionSheet 动作面板 由下面弹出的对话框
[] Countdown 倒计时
[] DatePicker 日期选择器

### 表单组件

[] Form 表单
[] input 输入框
