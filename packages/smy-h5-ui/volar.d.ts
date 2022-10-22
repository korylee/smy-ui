declare module 'vue' {
  export interface GlobalComponents {
    SmyCard: typeof import('@smy-h5/ui')['Card']
    SmyConfigProvider: typeof import('@smy-h5/ui')['ConfigProvider']
    SmyImgPreview: typeof import('@smy-h5/ui')['ImgPreview']
    SmyLazy: typeof import('@smy-h5/ui')['Lazy']
    SmyLoading: typeof import('@smy-h5/ui')['Loading']
    SmyPopup: typeof import('@smy-h5/ui')['Popup']
    SmyTeleport: typeof import('@smy-h5/ui')['Teleport']
    SmyToast: typeof import('@smy-h5/ui')['Toast']
  }
}

export {}
