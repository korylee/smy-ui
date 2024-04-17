import { ExtractPropTypes, createComponentProp, createContainProp, createStringProp } from '../_utils/vue/props'
// @ts-ignore
import WindowClose from '@smy-h5/icons/dist/es/WindowClose'

const TAG_TYPES = ['primary', 'success', 'danger', 'warning'] as const

export const props = {
  type: createContainProp(TAG_TYPES, false),
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
