import { PropType } from 'vue'
import { ExtractPropTypes, createNumericProp, createStringProp, numericProp } from '../_utils/vue/props'
import { GetTargetElementParam } from '../_utils/dom'

type StickyPosition = 'top' | 'bottom'

export const props = {
  zIndex: numericProp,
  position: createStringProp<StickyPosition>('top'),
  container: [HTMLDivElement, Object, String, Function] as PropType<GetTargetElementParam>,
  offsetTop: createNumericProp(0),
  offsetBottom: createNumericProp(0),
}

export type StickyProp = ExtractPropTypes<typeof props>
