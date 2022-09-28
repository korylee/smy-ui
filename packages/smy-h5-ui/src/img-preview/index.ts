import ImgPreview from './ImgPreview.vue'
import Vue from 'vue'
import { merge } from '../_utils/shared'

// 这玩意好用的话再挪出去
let ImgCtor
let imgPreviewGlobalConfig
let instance

export const handlePreviewImg = (options = {}) => {
  if (typeof options === 'string') {
    options = { url: options }
  }

  imgPreviewGlobalConfig && merge(options, imgPreviewGlobalConfig)
  if (!ImgCtor) {
    createImgPreview(options)
  }
  if (!instance) {
    instance = new ImgCtor({
      data: options,
    })
    instance.$mount()
    const dom = instance.$el
    document.body.appendChild(dom)
  }

  instance.show()
  return instance
}

const createImgPreview = (opts = {}) => {
  imgPreviewGlobalConfig = opts
  ImgCtor = Vue.extend(ImgPreview)
}

handlePreviewImg.install = (app, opts = {}) => {
  createImgPreview(opts)
  app.prototype.$previewImg = handlePreviewImg
}
