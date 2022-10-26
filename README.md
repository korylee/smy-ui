<h1 align="center">SMY H5 UI</h1>
<p align="center">一个 Vue 2 移动端 组件库</p>

## 项目结构

子项目命名规则：文件夹名 `smy-h5-*`, 项目名称：`@smy-h5/*`
子项目执行脚本：`pnpm --filter <项目名称> run <脚本名称>`

### @smy-h5/cli

组件库脚手架，内部内置了 dev，preview，build，lint，release 等命令
通过扫描 ui 文件目录示例 markdown 文件自动生成 router 文件

### @smy-h5/ui

基础组件库本体，不要写业务逻辑! 便于后面维护
@smy-h5/js 等不要打包进去，避免出现重复打包的情况

### @smy-h5/vtools

vue 的一些工具方法或混入

### @smy-h5/eslint-config

eslint config

### 待做。。。

将全流程，借款等独立的业务可以抽离作为一个项目。
便于后续投放及维护

> axios 等依赖不要打包进去，保持项目的干净，可将其作为外部依赖。后续可以将 axios 二次封装为一个定制化程度高的项目

## Git 贡献提交规范

- 参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) 规范 ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

  - `feat` 增加新功能
  - `fix` 修复问题/BUG
  - `style` 代码风格相关无影响运行结果的
  - `perf` 优化/性能提升
  - `refactor` 重构
  - `revert` 撤销修改
  - `test` 测试相关
  - `docs` 文档/注释
  - `chore` 依赖更新/脚手架配置修改等
  - `workflow` 工作流改进
  - `ci` 持续集成
  - `types` 类型定义文件更改
  - `wip` 开发中

## 安装

使用 pnpm 安装

```bash
pnpm i
```
