import { PropType } from 'vue'
import { assign } from '@smy-h5/shared'
import { checkerSharedProps } from '../checkbox/props'
import { ExtractPropTypes } from '../_utils/vue/props'

export type RadioShape = 'square' | 'round' | 'plain' | 'dot'

export const props = assign({}, checkerSharedProps, {
  shape: String as PropType<RadioShape>,
})

export type RadioProps = ExtractPropTypes<typeof props>
