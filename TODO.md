# bugfix
> 已知的bug

# feat
> 计划待做的功能
## @smy-h5/cli

### 命令
- [ ] compile (打包组件库)
  - [x] 打包生成es module文件格式
  - [ ] 打包生成commonjs文件格式
  - [ ] 组件类型文件编译
- [ ] dev (本地开发命令)
  - [ ] 热更新（修改配置重启，其余更新修改后的文件）
- [ ] lint (代码格式化)
  - [ ] 加入eslint格式化
  - [ ] 加入prettier格式化
  - [ ] 加入stylelint格式化
- [ ] build (打包文档样例网页)
  - [ ] 解析文件目录生成pc端路由
  - [ ] 加入嵌套的mobile iframe做预览
  - [ ] 解析文件目录生成mobile路由
  - [ ] 解析markdown文件生成vue文件
- [ ] preview （预览打包后的组件库文档）
- [ ] changlog (生成commit日志)
- [ ] test (单元测试)
- [ ] commitLint （commit美化）

## @smy-h5/ui
> 这里按实际需求来

### 基础组件
[] StyleProvider样式定制 / ConfigProvider配置定制
[x] loading 加载

### 展示组件

[x] Card 卡片
[x]ImgPreview 图片预览
  - [] 原组件写的有点死
### 导航组件
[] Tab 选项卡
### 功能指令
[x] lazy 图片懒加载
### 反馈组件
[] Toast 消息条
[] Dialog 对话框
[] Popup弹出层
[] ActionSheet 动作面板 由下面弹出的对话框
[] Countdown 倒计时
[] 日期选择器
### 表单组件
[] Form 表单
[] input 输入框