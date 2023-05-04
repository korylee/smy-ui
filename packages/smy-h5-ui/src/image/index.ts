import { type SmyComponent } from '../_utils/smy/component'
import { type ImageProps } from './props'

import Image from './Image.vue'
import { withInstall } from '../_utils/vue/component'

declare interface SmyImage extends SmyComponent {
  new (): {
    $props: ImageProps
    $emit: {
      (event: 'load', data: Event): void
      (event: 'error', data: Event): void
    }
  }
}

export default withInstall(Image) as SmyImage
