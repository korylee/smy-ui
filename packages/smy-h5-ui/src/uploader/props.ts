import { PropType } from 'vue/types/umd'
import {
  ExtractPropTypes,
  createArrayProp,
  createComponentProp,
  createNumericProp,
  createStringProp,
  truthProp,
} from '../_utils/vue/props'
import { type ImageFit } from '../image/props'
import { type Numeric } from '@smy-h5/shared'
import { UploaderFileListItem } from './utils'
//@ts-ignore
import Plus from '@smy-h5/icons/dist/es/Plus'

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
  previewImage: Boolean,
  uploadIcon: createComponentProp(Plus),
  uploadText: String,
}

export type UploaderProps = ExtractPropTypes<typeof props>
