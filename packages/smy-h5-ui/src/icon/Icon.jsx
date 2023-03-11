import { createGetMergedProp, InjectionKey } from '../config-provider/config'
import { convertToUnit } from '../_utils/dom'
import { props } from './props'
import './icon.less'
import { getSlots } from '../_utils/vue/slots'

const defaultTag = 'span'

const getMergedProp = createGetMergedProp('icon')

export default {
  name: 'SmyIcon',
  props,
  inject: {
    [InjectionKey]: {
      default: null,
    },
  },
  computed: {
    mergedTag() {
      return getMergedProp(this, 'tag', defaultTag)
    },
    mergedStyle() {
      const size = getMergedProp(this, 'size')
      return {
        color: getMergedProp(this, 'color'),
        fontSize: convertToUnit(size),
      }
    },
  },
  render(h) {
    const { mergedTag, mergedStyle } = this
    return h(mergedTag, { class: 'smy-icon', style: mergedStyle, on: this.$listeners }, getSlots(this))
  },
}
