import type { UploaderProps } from './props'
import type { SmyComponent } from '../_utils/smy/component'
import { type VNode } from 'vue'
import { type UploaderFileListItem } from './utils'

import { withInstall } from '../_utils/vue/component'
import _Uploader from './Uploader.vue'

declare interface SmyUploader extends SmyComponent {
  new (): {
    $props: UploaderProps
    $scopeSlots: {
      'preview-delete': () => VNode
    }
    $emit: {
      (event: 'input', data: UploaderFileListItem[]): void
      (event: 'delete', data: UploaderFileListItem): void
      (event: 'click-upload', data: Event): void
      (event: 'click-reupload', item: UploaderFileListItem, index: number): void
      (event: 'click-preview', item: UploaderFileListItem, index: number): void
      (event: 'before-read', data: File[]): void
      (event: 'after-read', data: UploaderFileListItem[]): void
    }
  }
}
export default withInstall(_Uploader) as unknown as SmyUploader
