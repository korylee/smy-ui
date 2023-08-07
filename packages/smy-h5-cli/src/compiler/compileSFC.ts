import { parse, resolve } from 'node:path'
import { readFile, writeFileSync } from 'fs-extra'
import {
  parse as parseSFC,
  compileScript as compileSFCScript,
  compileTemplate,
  SFCStyleBlock,
  compileStyle,
} from '@vue/compiler-sfc'
import hash from 'hash-sum'
import { compileScript } from './compileScript'
import { replaceExt, smartAppendFileSync } from '../shared/fs-utils'
import {
  clearEmptyLine,
  compileLess,
  extractStyleDependencies,
  normalizeStyleDependency,
  STYLE_IMPORT_RE,
} from './compileStyle'

export const EMPRY_COMMIT_RE = /\/\/\s*\n+/g

const EXPORT = 'export default'
const SFC = '__sfc__'
const SFC_DECLARE = `const ${SFC} = `
const RENDER = `__render__`

// 移除空行注释
const clearEmptyComment = (str: string) => str.replace(EMPRY_COMMIT_RE, '').trim()
const declareEmptySFC = () => `${SFC_DECLARE}{}\n`
const replaceExportToDeclare = (script: string) => script.replace(EXPORT, SFC_DECLARE)

export async function compileSFCFile(sfc: string) {
  const source: string = await readFile(sfc, 'utf-8')
  const id = hash(source)
  const { descriptor } = parseSFC(source, { sourceMap: false, filename: sfc })
  const { script, template, styles, scriptSetup } = descriptor

  let scriptContent
  let bindingMetadata

  if (script || scriptSetup) {
    if (scriptSetup) {
      const { content, bindings } = compileSFCScript(descriptor, { id })
      scriptContent = content
      bindingMetadata = bindings
    } else if (script) {
      scriptContent = script.content
    }
  }
  scriptContent = !scriptContent ? declareEmptySFC() : replaceExportToDeclare(scriptContent)

  const hasScope = styles.some((style) => style.scoped)
  const scopeId = hasScope ? `data-v-${id}` : ''

  if (template) {
    const { code: render } = compileTemplate({
      id,
      source: template.content,
      filename: sfc,
      compilerOptions: {
        expressionPlugins: script?.lang === 'ts' ? ['typescript'] : undefined,
        scopeId,
        bindingMetadata,
      },
    })
    scriptContent = injectRender(scriptContent, render)
  }
  if (scopeId) {
    scriptContent = injectScopeId(scriptContent, scopeId)
  }

  scriptContent = injectExport(scriptContent)
  await compileScript(scriptContent, sfc)

  for (let index = 0; index < styles.length; index++) {
    const style: SFCStyleBlock = styles[index]
    const lang = style.lang as undefined | 'less'
    const file = replaceExt(sfc, `Sfc${index || ''}.${lang}`)
    const { base, dir } = parse(file)
    const dependencyPath = normalizeStyleDependency(base, STYLE_IMPORT_RE)
    const cssFile = resolve(dir, `./style/index.js`)
    let { code } = compileStyle({
      source: style.content,
      filename: file,
      id: scopeId,
      scoped: style.scoped,
    })

    code = extractStyleDependencies(file, code, STYLE_IMPORT_RE)
    code = clearEmptyLine(code)
    writeFileSync(file, code, 'utf-8')
    smartAppendFileSync(cssFile, `import '${dependencyPath}.css'\n`)

    style.lang === 'less' && compileLess(file)
  }
}

export function injectRender(script: string, render: string): string {
  script = clearEmptyComment(script)

  render = render.replace('export function render', `function ${RENDER}`)
  script = script.replace(SFC_DECLARE, `${render}\n${SFC_DECLARE}`)
  script += `\n${SFC}.render = ${RENDER}`

  return script
}

export function injectScopeId(script: string, scopeId: string): string {
  script += `\n${SFC}.__scopeId = '${scopeId}'`

  return script
}

export function injectExport(script: string) {
  script += `\n${EXPORT} ${SFC}`
  return script
}
