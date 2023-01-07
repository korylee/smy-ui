import type { ExtractPropTypes } from "@smy-h5/vtools"

export const props = {
  title: { type: String, defualt: '' },
  content: { type: String, default: '' },
}

export type StepProps = ExtractPropTypes<typeof props>
