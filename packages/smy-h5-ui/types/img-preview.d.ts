import Vue from 'vue'

export declare class ImgPreview extends Vue {}

export interface ImgPreviewOptions {
  url: string
}

export interface HandlePreviewImg {
  (url: string): ImgPreview
  (options: ImgPreviewOptions): ImgPreview

  install(app: Vue, options: ImgPreviewOptions): void
}

export declare type handlePreviewImg = HandlePreviewImg

declare module 'vue/types/vue' {
  interface Vue {
    $previewImg: HandlePreviewImg
  }
}
