<template>
  <div :class="bem()">
    <div :class="bem('wrapper', { disabled })">
      <template v-if="preview">
        <div v-for="(item, index) of value" :key="getItemId(item)" :class="bem('preview')">
          <div v-if="['loading', 'error'].includes(item.status)" :class="bem('mask')">
            <div v-if="item.message" :class="bem('mask-message')">{{ item.message }}</div>
          </div>
          <smy-image
            v-if="isImageFile(item)"
            :src="item.content || item.url"
            :class="bem('preview-image')"
            :fit="item.imageFit || imageFit"
            @click="onClickImage(item, index)"
          />
          <div
            v-if="(item.deletable || deletable) && item.status !== 'loading'"
            :class="bem('preview-delete', { shadow: !hasSlot('preview-delete') })"
            role="button"
            tabindex="0"
            aria-label="delete"
            @click.stop="onDelete(item, index)"
          >
            <slot name="preview-delete"><smy-icon :class="bem('preview-delete-icon')" name="window-close" /></slot>
          </div>
        </div>
      </template>
      <div
        v-if="value.length < +maxCount"
        :class="bem('upload', { readonly })"
        v-show="showUpload"
        @click="onClickUpload"
      >
        <smy-icon :name="uploadIcon" :class="bem('upload-icon')" />
        <span v-if="uploadText" :class="bem('upload-text')">{{ uploadText }}</span>
        <input
          v-if="!readonly"
          ref="input"
          :class="bem('input')"
          :accept="accept"
          :capture="capture"
          :multiple="multiple && reuploadIndex === -1"
          :disabled="disabled"
          type="file"
          @change="onChange"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { createNamespace } from '../_utils/vue/create'
import SmyIcon from '../icon'
import SmyImage from '../image'
import { props } from './props'
import { readFileContent, isOversize, filterFiles, isImageFile } from './utils'
import { SlotsMixin } from '../_mixins/slots'
import { ListenersMixin } from '../_mixins/listeners'
import { isNil, wrapInArray } from '@smy-h5/shared'
import ImagePreview from '../image-preview'
import WindowClose from '@smy-h5/icons/dist/es/WindowClose'

const [name, bem] = createNamespace('uploader')

SmyIcon.use('window-close', WindowClose)

let fid = 0

export default {
  name,
  mixins: [SlotsMixin, ListenersMixin],
  components: { SmyIcon, SmyImage },
  props,
  data: () => ({
    reuploadIndex: -1,
    urls: [],
  }),
  mounted() {
    this.urls.forEach((url) => URL.revokeObjectURL(url))
  },
  methods: {
    bem,
    isImageFile,
    getItemId(item) {
      if (isNil(item.id)) return (item.id = ++fid)
      return item.id
    },
    onChange(event) {
      const { files } = event.target
      if (this.disabled || !files?.length) {
        return
      }
      const file = Array.from(files)
      const { getListener } = this
      const onBeforeRead = getListener('before-read')
      Promise.resolve(onBeforeRead ? onBeforeRead(file) : file)
        .then((data) => this.readFile(data ?? file))
        .catch(this.resetInput)
    },
    onDelete(item, index) {
      const fileList = this.value.slice(0)
      fileList.splice(index, 1)
      this.$emit('input', fileList)
      this.$emit('delete', item)
    },
    onClickUpload(event) {
      const { getListener } = this
      const onClickUpload = getListener('click-upload')
      onClickUpload(event)
    },
    onReupload(index) {
      this.chooseFile()
      this.reuploadIndex = index
    },
    onPreview(item) {
      if (!this.previewImage) return
      const { getListener } = this
      const onClosePreview = getListener('close-preview')
      const imageFiles = this.value.filter(isImageFile)
      const images = []
      imageFiles.forEach((item) => {
        if (item.file && !item.url && item.status !== 'error') {
          const url = URL.createObjectURL(item.file)
          item.url = url
          this.urls.push(url)
        }
        if (!item.url) return
        images.push(item.url)
      })
      ImagePreview({
        images,
        initialIndex: imageFiles.indexOf(item),
        onClose: onClosePreview,
      })
    },
    onClickImage(item, index) {
      const { getListener } = this
      const onClickReupload = getListener('click-reupload')
      const onClickPreview = getListener('click-preview')
      if (this.reupload) {
        onClickReupload(item, index)
        this.onReupload(index)
        return
      }
      onClickPreview(item, index)
      this.onPreview(item)
    },
    chooseFile() {
      const { input } = this.$refs
      if (!input || this.disabled) return
      input.click()
    },
    resetInput() {
      const { input } = this.$refs
      if (!input || this.disabled) return
      input.value = ''
    },
    onAfterRead(items) {
      this.resetInput()
      const { maxSize, value, reuploadIndex } = this
      const { getListener } = this
      const onAfterRead = getListener('after-read')
      if (isOversize(items, maxSize)) {
        const result = filterFiles(items, maxSize)
        items = result.valid
        this.$emit('oversize', result.invalid)
        if (!items.length) {
          return
        }
      }
      if (reuploadIndex > -1) {
        const arr = value.slice()
        arr.splice(reuploadIndex, 1, items)
        this.$emit('input', arr)
        this.reuploadIndex = -1
      } else {
        this.$emit('input', [...value, ...items])
      }
      onAfterRead?.(items)
    },
    readFile(files) {
      const { maxCount, value, resultType } = this
      files = wrapInArray(files)
      const remainCount = +maxCount - value.length
      if (files.length > remainCount) {
        files = files.slice(0, remainCount)
      }
      Promise.all(files.map((file) => readFileContent(file, resultType))).then((contents) => {
        const fileList = files.map((file, index) => {
          const result = {
            id: fid++,
            file,
            status: '',
            message: '',
          }
          const content = contents[index]
          content && (result.content = content)
          return result
        })
        this.onAfterRead(fileList)
      })
    },
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
@import '../icon/icon.less';
@import '../image/image.less';
@import '../image-preview/imagePreview.less';
@import './uploader.less';
</style>
