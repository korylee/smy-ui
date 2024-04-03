import { PropType, VNode } from 'vue'
import { assign, keys } from '@smy-h5/shared'
import { ExtractPropTypes, createStringProp, numericProp, truthProp } from '../_utils/vue/props'
import { popupSharedProps } from '../popup/shared'

export type DialogMessage = string | (() => VNode | string)

const popupInheritProps = assign({}, popupSharedProps, {
  closeOnClickOverlay: Boolean,
  transition: createStringProp('smy-dialog-bounce'),
})

export const props = assign({}, popupInheritProps, {
  title: String,
  width: numericProp,
  content: [String, Function] as PropType<DialogMessage>,
  allowHtml: Boolean,
  showCancel: Boolean,
  cancelText: String,
  cancelColor: String,
  showConfirm: truthProp,
  confirmText: String,
  confirmColor: String,
})

export const popupInheritPropKeys = keys(popupInheritProps)

export type DialogProps = ExtractPropTypes<typeof props>
