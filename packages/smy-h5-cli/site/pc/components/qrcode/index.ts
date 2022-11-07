import QrCode from './QrCode.vue'

QrCode.install = function (app) {
  app.component(QrCode.name, QrCode)
}

export default QrCode
