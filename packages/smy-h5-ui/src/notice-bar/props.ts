import type { PropType } from 'vue'

export const props = {
  // 滚动方向  across 横向 vertical 纵向
  direction: {
    type: String as PropType<'across' | 'vertical'>,
    default: 'across',
  },
  list: {
    type: Array,
    default: () => [],
  },
  standTime: {
    type: Number,
    default: 1000,
  },
  complexAm: {
    type: Boolean,
    default: false,
  },
  height: {
    type: Number,
    default: 40,
  },
  text: {
    type: String,
    default: '',
  },
  closable: {
    type: Boolean,
    default: false,
  },
  wrapable: {
    type: Boolean,
    default: false,
  },
  leftIcon: { type: String, default: '' },
  color: {
    type: String,
    default: '#F9911B',
  },
  background: {
    type: String,
    default: 'rgba(254,250,216,1)',
  },
  delay: {
    type: [String, Number],
    default: 1,
  },
  scrollable: {
    type: Boolean,
    default: true,
  },
  speed: {
    type: Number,
    default: 50,
  },
}
