import type { ExtractPropTypes } from '../_utils/vue/props'
import type { PropType } from 'vue'

const TAG_TYPES = ['primary', 'success', 'danger', 'warning'] as const
type TagType = (typeof TAG_TYPES)[number]

export const props = {
  type: {
    type: String as PropType<TagType>,
    default: '',
    validator: (val: TagType) => !val || TAG_TYPES.includes(val),
  },
  color: { type: String, defualt: '' },
  textColor: { type: String, default: '' },
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
}

export type TagProps = ExtractPropTypes<typeof props>
