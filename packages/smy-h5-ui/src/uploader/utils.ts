import { wrapInArray, isFunction, isString } from '@smy-h5/shared'
import { ImageFit } from '../image/props'
import { UploaderMaxSize, UploaderResultType } from './props'

export type UploaderFileListItem = {
  id?: number | string
  url?: string
  file?: File
  content?: string
  isImage?: boolean
  status?: 'loading' | 'success' | 'error'
  message?: string
  imageFit?: ImageFit
  deletable?: boolean
  reupload?: boolean
  // previewSize?: string | number
  // beforeDelete?: Interceptor;
}

export function readFileContent(file: File, resultType: UploaderResultType) {
  return new Promise<string | void>((resolve) => {
    if (resultType === 'file') {
      return resolve()
    }
    const reader = new FileReader()

    reader.onload = function (event) {
      resolve(event.target?.result as string)
    }
    if (resultType === 'dataUrl') {
      reader.readAsDataURL(file)
    } else if (resultType === 'text') {
      reader.readAsText(file)
    }
  })
}

export function isOversize(items: UploaderFileListItem | UploaderFileListItem[], maxSize: UploaderMaxSize) {
  return wrapInArray(items).some((item) => {
    if (item.file) {
      if (isFunction(maxSize)) {
        return maxSize(item.file)
      }
      return item.file.size > +maxSize
    }
    return false
  })
}

export function filterFiles(items: UploaderFileListItem[], maxSize: UploaderMaxSize) {
  const valid: UploaderFileListItem[] = []
  const invalid: UploaderFileListItem[] = []

  items.forEach((item) => {
    if (isOversize(item, maxSize)) {
      invalid.push(item)
    } else {
      valid.push(item)
    }
  })

  return { valid, invalid }
}

const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg|avif)/i

export const isImageUrl = (url: string) => IMAGE_REGEXP.test(url)

export function isImageFile(item: UploaderFileListItem) {
  if (item.isImage) {
    return true
  }
  if (item.file?.type) {
    return item.file.type.indexOf('image') === 0
  }
  if (item.url) {
    return isImageUrl(item.url)
  }
  if (isString(item.content)) {
    return item.content.indexOf('data:image') === 0
  }
  return false
}
