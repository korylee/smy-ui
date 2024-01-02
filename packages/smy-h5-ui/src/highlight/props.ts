import { PropType } from 'vue'
import { ExtractPropTypes, createRequiredProps, createStringProp, truthProp } from '../_utils/vue/props'

export const props = {
  tag: createStringProp('div'),
  content: createStringProp(''),
  highlightTag: createStringProp('span'),
  highlightClass: String,
  unhighlightClass: String,
  unhighlightTag: createStringProp('span'),
  keywords: createRequiredProps<PropType<string | RegExp | (string | RegExp)[]>>([String, RegExp, Array]),
  autoEscape: truthProp,
  caseSensitive: Boolean,
}

export type HighLightProps = ExtractPropTypes<typeof props>
