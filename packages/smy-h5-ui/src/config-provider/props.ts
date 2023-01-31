import type { ExtractPropTypes } from '../_utils/vue/props'
import type { PropType } from 'vue'
export type StyleVars = Record<string, string>

export const props = {
  styleVars: {
    type: Object as PropType<StyleVars>,
    default: () => ({}),
  },
  tag: {
    type: String as PropType<keyof HTMLElementTagNameMap | string>,
    default: 'div',
  },
}

export type ConfigProviderProps = ExtractPropTypes<typeof props>
