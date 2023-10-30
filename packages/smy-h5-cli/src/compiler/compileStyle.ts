import { replaceExt, smartAppendFileSync } from '../shared/fs-utils'
import { parse, resolve } from 'path'
import { render } from 'less'
import { readFileSync, writeFileSync } from 'fs-extra'

export const EMPTY_SPACE_RE = /[\s]+/g
export const EMPTY_LINE_RE = /[\n\r]*/g
export const IMPORT_CSS_RE = /(?<!['"`])import\s+['"](\.{1,2}\/.+\.css)['"]\s*;?(?!\s*['"`])/g
export const IMPORT_LESS_RE = /(?<!['"`])import\s+['"](\.{1,2}\/.+\.less)['"]\s*;?(?!\s*['"`])/g
export const REQUIRE_CSS_RE = /(?<!['"`])require\(\s*['"](\.{1,2}\/.+\.css)['"]\s*\);?(?!\s*['"`])/g
export const REQUIRE_LESS_RE = /(?<!['"`])require\(\s*['"](\.{1,2}\/.+\.less)['"]\s*\);?(?!\s*['"`])/g
export const STYLE_IMPORT_RE = /@import\s+['"](.+)['"]\s*;/g
export const STYLE_EXT = /(.less)|(.css)/

export const clearEmptyLine = (s: string) => s.replace(EMPTY_LINE_RE, '').replace(EMPTY_SPACE_RE, ' ')

interface ExtractStyleDependenciesOptions {
  expect?: 'css' | 'less'
  self?: boolean
  reg?: RegExp
}

export function extractStyleDependencies(
  file: string,
  code: string,
  { expect = 'css', self = false, reg }: ExtractStyleDependenciesOptions = {},
) {
  code = code.trim()
  if (!code) return code
  const { dir, base } = parse(file)
  const styleReg = reg ?? (expect === 'css' ? IMPORT_CSS_RE : IMPORT_LESS_RE)
  const styleImports = code.match(styleReg) ?? []
  const cssFile = resolve(dir, './style/index.js')
  const lessFile = resolve(dir, './style/less.js')

  styleImports.forEach((styleImport: string) => {
    const normalizedPath = normalizeStyleDependency(styleImport, styleReg)
    smartAppendFileSync(cssFile, `import '${normalizedPath}.css'\n`)
    smartAppendFileSync(lessFile, `import '${normalizedPath}.${expect}'\n`)
  })

  if (self && STYLE_EXT.test(base)) {
    const dirname = normalizeStyleDependency(base, styleReg)
    smartAppendFileSync(cssFile, `import '${dirname}.css'\n`)
    smartAppendFileSync(lessFile, `import '${dirname}.${expect}'\n`)
  }
  return code.replace(styleReg, '')
}

export function normalizeStyleDependency(styleImport: string, reg: RegExp) {
  const relativePath = styleImport.replace(reg, '$1').replace(STYLE_EXT, '')
  if (relativePath.startsWith('/')) {
    return '.' + relativePath
  }
  return '../' + relativePath
}

export async function compileLess(file: string) {
  const source = readFileSync(file, 'utf-8')
  const { css } = await render(source, { filename: file })

  writeFileSync(replaceExt(file, '.css'), clearEmptyLine(css), 'utf-8')
}
