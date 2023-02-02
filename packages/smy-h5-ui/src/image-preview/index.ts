import type { ImagePreviewProps } from './props'
import type { SmyComponent } from '../_utils/smy/component'

import { mountComponent, withInstall } from '../_utils/vue/component'
import _ImagePreview from './ImagePreview.vue'
import Vue from 'vue'
import { isArray, isNill, isString } from '../_utils/is'
import { inBrowser } from '../_utils/env'

declare interface SmyImagePreview extends SmyComponent {
  new (): {
    $props: ImagePreviewProps
  }
}

const SmyImgPreview = withInstall(_ImagePreview) as unknown as SmyImagePreview

type ImagePreviewOptions = ImagePreviewProps & {
  onOpen?: () => void
  onOpened?: () => void
  onClose?: () => void
  onClosed?: () => void
  onChange?: (index: number) => void
}

let singletonInstance: ImagePreviewOptions | null

const ImagePreview = function ImagePreview(options: string | string[] | ImagePreviewOptions) {
  if (!inBrowser()) return
  ImagePreview.close()

  const imagePreviewOptions: ImagePreviewOptions = isString(options)
    ? { images: [options] }
    : isArray(options)
    ? { images: options }
    : options

  const { instance, unmount } = mountComponent(SmyImgPreview as any, 'body', { propsData: { ...imagePreviewOptions } })

  instance.show = true

  singletonInstance = instance

  instance.$on('update:show', (val: boolean) => {
    instance.show = val
  })
  instance.$on('route-change', () => {
    unmount()
    singletonInstance === instance && (singletonInstance = null)
  })
  instance.$on('change', (index: number) => {
    imagePreviewOptions.onChange?.(index)
  })
  instance.$on('open', () => imagePreviewOptions.onOpen?.())
  instance.$on('opened', () => imagePreviewOptions.onOpened?.())
  instance.$on('close', () => imagePreviewOptions.onClose?.())
  instance.$on('closed', () => {
    imagePreviewOptions.onClosed?.()
    unmount()
    singletonInstance === imagePreviewOptions && (singletonInstance = null)
  })
  instance.show = true
}

ImagePreview.close = function () {
  if (isNill(singletonInstance)) return
  const preSingletonInstance = singletonInstance
  singletonInstance = null
  Vue.nextTick(() => {
    preSingletonInstance.show = false
  })
}

ImagePreview.install = SmyImgPreview.install

ImagePreview.Component = SmyImgPreview

export default ImagePreview
