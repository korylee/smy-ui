import AppBar from './AppBar.vue'

AppBar.install = function (app) {
  app.component(AppBar.name, AppBar)
}

export default AppBar
