import { PropType } from 'vue/types/umd'
import { ExtractPropTypes, createArrayProp, createNumericProp, createStringProp, truthProp } from '../_utils/vue/props'
import { type ImageFit } from '../image/props'
import { type Numeric } from '../_utils/is'
import { UploaderFileListItem } from './utils'

export type UploaderResultType = 'dataUrl' | 'text' | 'file'

export type UploaderMaxSize = Numeric | ((file: File) => boolean)

export const props = {
  value: createArrayProp<UploaderFileListItem>(),
  accept: createStringProp('image/*'),
  capture: String,
  multiple: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  reupload: Boolean,
  showUpload: truthProp,
  deletable: truthProp,
  maxCount: createNumericProp(Infinity),
  maxSize: {
    type: [Number, String, Function] as PropType<UploaderMaxSize>,
    default: Infinity,
  },
  imageFit: createStringProp<ImageFit>('cover'),
  resultType: createStringProp<UploaderResultType>('dataUrl'),
  preview: truthProp,
  previewSize: [Number, String, Array] as PropType<Numeric | [Numeric, Numeric]>,
  previewImage: Boolean,
  uploadIcon: createStringProp('plus'),
  uploadText: String,
}

export type UploaderProps = ExtractPropTypes<typeof props>