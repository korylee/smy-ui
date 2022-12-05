import type { PropType } from 'vue'

export const props = {
  direction: {
    type: String as PropType<'vertical' | 'horizontal'>,
    default: 'horizontal',
  },
  current: {
    type: [String, Number],
    default: 0,
  },
  progressDot: {
    type: Boolean,
    defualt: false,
  },
}
