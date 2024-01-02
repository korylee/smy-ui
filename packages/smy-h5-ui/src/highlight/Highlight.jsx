import { isString } from '../_utils/is'
import { wrapInArray } from '../_utils/shared'
import { createNamespace } from '../_utils/vue/create'
import { props } from './props'

import '../_styles/common.less'
import './highlight.less'

const [name, bem] = createNamespace('highlight')

export default {
  name,
  props,
  computed: {
    chunks(vm) {
      const { keywords: _keywords, autoEscape, caseSensitive, content } = vm
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
    },
  },
  render() {
    const _vm = this
    const _h = _vm.$createElement
    const { tag } = _vm

    const renderContent = () => {
      const { content, highlightClass, highlightTag, unhighlightClass, unhighlightTag, chunks } = _vm
      return chunks.map((chunk) => {
        const { highlight, start, end } = chunk
        const text = content.slice(start, end)
        if (highlight) {
          return _vm._t('highlight', () => [_h(highlightTag, { class: [bem('highlight'), highlightClass] }, [text])], {
            text,
          })
        }
        return _vm._t('unhighlight', () => [_h(unhighlightTag, { class: [unhighlightClass] }, [text])], {
          text,
        })
      })
    }

    return _h(tag, { class: bem() }, [renderContent()])
  },
}
