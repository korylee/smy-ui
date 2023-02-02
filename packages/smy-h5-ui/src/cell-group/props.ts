import type { ExtractPropTypes } from "../_utils/vue/props"

export const props = {
  insert: Boolean,
}

export type CellGroupProps = ExtractPropTypes<typeof props>
