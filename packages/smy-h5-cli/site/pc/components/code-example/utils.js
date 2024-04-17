export function handleCopy(text = '') {
  const isSupported = !!document.queryCommandSupported && !!document.queryCommandSupported('copy')
  if (!isSupported) return false
  const inputId = 'copy-input-el'
  try {
    /**
     * @type {HTMLTextAreaElement}
     */
    // @ts-ignore
    let copyInputEl = document.getElementById(inputId)
    if (!copyInputEl) {
      copyInputEl = document.createElement('textarea')
      copyInputEl.id = inputId
      const isRTL = document.documentElement.getAttribute('dir') === 'rtl'
      // Prevent zooming on iOS
      copyInputEl.style.fontSize = '12pt'
      // Reset box model
      copyInputEl.style.border = '0'
      copyInputEl.style.padding = '0'
      copyInputEl.style.margin = '0'
      // Move element out of screen horizontally
      copyInputEl.style.position = 'absolute'
      copyInputEl.style[isRTL ? 'right' : 'left'] = '-9999px'
      // Move element to the same position vertically
      const yPosition = window.pageYOffset || document.documentElement.scrollTop
      copyInputEl.style.top = `${yPosition}px`
      copyInputEl.setAttribute('readonly', '')
      document.body.appendChild(copyInputEl)
    }
    copyInputEl.value = text
    // copyInputEl.focus();
    copyInputEl.setSelectionRange(0, text.length)
    copyInputEl.select()
    return document.execCommand('copy')
  } catch (e) {
    return false
  }
}

let highligher
export async function genHighlighter() {
  if (highligher) {
    return highligher
  }
  const { getHighlighter } = await import('shiki')
  highligher = await getHighlighter({
    themes: ['catppuccin-latte'],
    langs: ['typescript', 'javascript', 'css', 'less', 'scss', 'vue', 'html', 'vue-html'],
  })
  return highligher
}
