import { isString, wrapInArray } from '@smy-h5/shared'
import { createNamespace } from '../_utils/vue/create'
import { props } from './props'

import '../_styles/common.less'
import './highlight.less'
import { computed, defineComponent, h, unref } from 'vue'

const [name, bem] = createNamespace('highlight')

export default defineComponent({
  name,
  props,
  setup(props, { slots }) {
    const chunks = computed(() => {
      const { keywords: _keywords, autoEscape, caseSensitive, content } = props
      const keywords = wrapInArray(_keywords)

      const highlightChunks = []
      keywords.forEach((keyword) => {
        if (!keyword) return
        const flags = caseSensitive ? 'g' : 'gi'
        if (isString(keyword) && autoEscape) {
          keyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        }
        const regex = new RegExp(keyword, flags)

        let match
        while ((match = regex.exec(content))) {
          const start = match.index
          const end = regex.lastIndex
          if (start >= end) {
            regex.lastIndex++
            continue
          }
          highlightChunks.push({ start, end, highlight: true })
        }
      })
      highlightChunks.sort((a, b) => a.start - b.start)
      const chunks = []
      let prevChunk
      highlightChunks.forEach((currentChunk) => {
        if (!prevChunk || currentChunk.start > prevChunk.end) {
          const unhighlightStart = prevChunk ? prevChunk.end : 0
          const unhighlightEnd = currentChunk.start
          if (unhighlightStart !== unhighlightEnd) {
            chunks.push({
              start: unhighlightStart,
              end: unhighlightEnd,
              highlight: false,
            })
          }
          chunks.push(currentChunk)
          prevChunk = currentChunk
        } else {
          prevChunk.end = Math.max(prevChunk.end, currentChunk.end)
        }
      })
      if (prevChunk && prevChunk.end < content.length) {
        chunks.push({
          start: prevChunk.end,
          end: content.length,
          highlight: false,
        })
      }

      return chunks
    })
    return () => {
      const renderContent = () =>
        unref(chunks).map((chunk) => {
          const { highlight, start, end } = chunk
          const text = props.content.slice(start, end)
          if (highlight) {
            return slots.highlight
              ? slots.highlight({ text })
              : h(props.highlightTag, { class: [bem('highlight'), props.highlightClass] }, [text])
          }
          return slots.unhighlight
            ? slots.unhighlight({ text })
            : h(props.unhighlightTag, { class: [bem('unhighlight'), props.unhighlightClass] }, [text])
        })

      return h(props.tag, { class: bem() }, [renderContent()])
    }
  },
})
