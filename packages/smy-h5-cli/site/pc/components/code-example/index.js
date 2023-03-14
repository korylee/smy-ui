import CodeExample from './CodeExample.vue'

CodeExample.install = function (app) {
  app.component(CodeExample.name, CodeExample)
}

export default CodeExample
