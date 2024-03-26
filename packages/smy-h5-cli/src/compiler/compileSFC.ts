import { readFile, writeFileSync } from 'fs-extra'
import * as compiler from 'vue-template-compiler'
import * as compilerSfc from '@vue/compiler-sfc'
import stripWith from 'vue-template-es2015-compiler'
import hash from 'hash-sum'
import { compileScript } from './compileScript'
import { replaceExt } from '../shared/fs-utils'
import { clearEmptyLine, compileLess, extractStyleDependencies, STYLE_IMPORT_RE } from './compileStyle'

const EXPORT_START_RE = /export\s+default\s+{/
const DEFINE_EXPORT_START_RE = /export\s+default\s+defineComponent\s*\(\s*{/
export const EMPRY_COMMIT_RE = /\/\/\s*\n+/g

const RENDER_NAME = '__sfc_render'
const STATIC_RENDER_FNS_NAME = '__sfc_staticRenderFns'

// 移除空行注释
const clearEmptyComment = (str: string) => str.replace(EMPRY_COMMIT_RE, '')

export async function compileSFCFile(sfc: string) {
  const source: string = await readFile(sfc, 'utf-8')
  const { descriptor } = compilerSfc.parse(source, { sourceMap: false })
  const { script, template, styles } = descriptor

  let content = script?.content ?? `export default {  }`

  if (template) {
    const { render, staticRenderFns } = compileTemplate(template.content)
    content = injectRender(content, render + staticRenderFns)
  }

  const hasScope = styles.some((style) => style.scoped)
  const scopeId = hasScope ? `data-v-${hash(source)}` : ''
  if (scopeId) {
    content = injectScopeId(content, scopeId)
  }

  await compileScript(content, sfc)

  for (let index = 0; index < styles.length; index++) {
    const style = styles[index]
    const lang = style.lang as undefined | 'less'
    const file = replaceExt(sfc, `Sfc${index || ''}.${lang}`)
    let code = style.content.trim()

    if (scopeId) {
      ;({ code } = compilerSfc.compileStyle({
        source: code,
        filename: file,
        id: scopeId,
        scoped: style.scoped,
        preprocessLang: lang,
      }))
    }

    code = extractStyleDependencies(file, code, {
      expect: lang,
      self: true,
      reg: STYLE_IMPORT_RE,
    })
    code = clearEmptyLine(code)
    writeFileSync(file, code, 'utf-8')

    style.lang === 'less' && compileLess(file)
  }
}

export function injectRender(script: string, render: string): string {
  script = script.trim()
  script = clearEmptyComment(script)

  if (DEFINE_EXPORT_START_RE.test(script)) {
    return script.replace(
      DEFINE_EXPORT_START_RE,
      `
${render}\nexport default defineComponent({
render: ${RENDER_NAME},\
staticRenderFns: ${STATIC_RENDER_FNS_NAME},\
`,
    )
  }

  if (EXPORT_START_RE.test(script)) {
    return script.replace(
      EXPORT_START_RE,
      `${render}\nexport default {
render: ${RENDER_NAME},\
staticRenderFns: ${STATIC_RENDER_FNS_NAME},\
`,
    )
  }

  return script
}

export function injectScopeId(script: string, scopeId: string): string {
  if (EXPORT_START_RE.test(script.trim())) {
    return script.trim().replace(
      EXPORT_START_RE,
      `export default {
_scopeId: '${scopeId}',\
`,
    )
  }

  return script
}

function compileTemplate(template: string) {
  const { render, staticRenderFns } = compiler.compile(template)

  return {
    render: stripWith(`function ${RENDER_NAME} () { ${render} }`),
    staticRenderFns: `const ${STATIC_RENDER_FNS_NAME} = [${staticRenderFns
      .map((staticRenderFn) => stripWith(`function _() { ${staticRenderFn} }`))
      .join(',\n')}]`,
  }
}
