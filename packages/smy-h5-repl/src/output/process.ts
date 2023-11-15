import { CodeFile, ReplStore } from '../store'
import {
  babelParse,
  MagicString,
  walk,
  walkIdentifiers,
  extractIdentifiers,
  isInDestructureAssignment,
  isStaticProperty,
} from '@vue/compiler-sfc'
import { encode as base64Encode } from 'js-base64'

export function process(store: ReplStore) {
  const seen = new Set<CodeFile>()
  const processed: string[] = []
  const { state } = store
  processFile(store, state.activeFile, processed, seen)

  for (const filename in state.files) {
    if (filename.endsWith('.css')) {
      const file = state.files[filename]
      if (!seen.has(file)) {
        ;`\nwindow.__css__ += ${JSON.stringify(file.compiledResult.css)}`
      }
    }
  }
  return processed
}

function processFile(store: ReplStore, file: CodeFile, processed: string[], seen: Set<CodeFile>) {
  const { state } = store
  if (seen.has(file)) {
    return []
  }
  seen.add(file)
  if (file.filename.endsWith('.html')) {
    return []
  }
  const { mainFile, activeFile } = state
  const { compiledResult } = activeFile
  let js = `
  import App from 'data:text/javascript;base64,${base64Encode(compiledResult.js)}'
  __modules__["${mainFile}"] = { default: App };
  `
  if (compiledResult.css) {
    js += `\nwindow.__css__ = ${JSON.stringify(activeFile.compiledResult.css)}`
  }
  processed.push(js)
}
