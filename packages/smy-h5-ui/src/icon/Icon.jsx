import { createGetMergedProp, InjectionKey } from '../config-provider/config'
import Vue from 'vue'
import { getSlots } from '@smy-h5/vtools'
import { convertToUnit } from '../_utils/shared'
import { props } from './props'

import './icon.less'

const defaultTag = 'span'

const getMergedProp = createGetMergedProp('icon')

export default Vue.extend({
  name: 'SmyIcon',
  props,
  inject: {
    [InjectionKey]: {
      default: null,
    },
  },
  computed: {
    mergedTag() {
      return getMergedProp(this, 'tag') ?? defaultTag
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
    return h(mergedTag, { class: 'smy-icon', style: mergedStyle }, getSlots(this))
  },
})
