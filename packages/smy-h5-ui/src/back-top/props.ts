import { PropType } from 'vue'
import { ExtractPropTypes, createNumericProp, numericProp } from '../_utils/vue/props'
import { TeleportProps } from '../teleport'

export const props = {
  right: numericProp,
  bottom: numericProp,
  zIndex: numericProp,
  target: [String, Object] as PropType<TeleportProps['to']>,
  offset: createNumericProp(200),
  immediate: Boolean,
  teleport: {
    type: [String, Object] as PropType<TeleportProps['to']>,
    default: 'body',
  },
}

export type BackTopProps = ExtractPropTypes<typeof props>
