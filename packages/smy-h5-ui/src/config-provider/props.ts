import type { ExtractPropTypes } from '@smy-h5/vtools'
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
