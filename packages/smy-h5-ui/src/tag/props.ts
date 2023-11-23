import { ExtractPropTypes, createComponentProp, createStringProp } from '../_utils/vue/props'
import type { PropType } from 'vue'
// @ts-ignore
import WindowClose from '@smy-h5/icons/dist/es/WindowClose'

const TAG_TYPES = ['primary', 'success', 'danger', 'warning'] as const
type TagType = (typeof TAG_TYPES)[number]

export const props = {
  type: {
    type: String as PropType<TagType>,
    default: '',
    validator: (val: TagType) => !val || TAG_TYPES.includes(val),
  },
  color: createStringProp(''),
  textColor: createStringProp(''),
  plain: {
    type: Boolean,
    default: false,
  },
  round: {
    type: Boolean,
    default: false,
  },
  mark: {
    type: Boolean,
    default: false,
  },
  closeable: {
    type: Boolean,
    default: false,
  },
  closeIcon: createComponentProp(WindowClose),
}

export type TagProps = ExtractPropTypes<typeof props>
