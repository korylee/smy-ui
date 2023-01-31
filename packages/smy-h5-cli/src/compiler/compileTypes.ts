import type { SourceFile } from 'ts-morph'

import { ensureDir, pathExistsSync, readdir, writeFile } from 'fs-extra'
import { getSmyConfig } from '../config/getConfig'
import {
  UI_PACKAGE_JSON,
  TS_CONFIG,
  TS_TYPES_CONFIG,
  SRC_DIR,
  CWD,
  TYPES_DIR,
  EXAMPLE_DIR_NAME,
  DOCS_DIR_NAME,
  TESTS_DIR_NAME,
  STYLE_DIR_NAME,
} from '../shared/constant'
import { resolve } from 'path'
import { camelCase, upperFirst } from 'lodash'
const path = require('path')
const fs = require('fs')
const { Project } = require('ts-morph')
const { parse, compileScript } = require('@vue/compiler-sfc')
import { isDir, isDTS, isPublicDir, isScript, isSFC } from '../shared/fs-utils'

export async function compileTypes() {
  await ensureDir(TYPES_DIR)
  await Promise.all([comipleTypesEntry(), compileModuleTypes()])
}

let index = 1

const getIsTs = (str: string) => ['ts', 'tsx'].includes(str)

export async function compileDts(files: string[]) {
  // 这部分内容具体可以查阅 ts-morph 的文档
  // 这里仅需要知道这是用来处理 ts 文件并生成类型声明文件即可
  const project = new Project({
    compilerOptions: {
      declaration: true,
      emitDeclarationOnly: true,
      noEmitOnError: true,
      allowJs: true, // 如果想兼容 js 语法需要加上
      outDir: TYPES_DIR, // 可以设置自定义的打包文件夹，如 'types'
      jsx: true,
      noEmit: false,
    },
    tsConfigFilePath: pathExistsSync(TS_TYPES_CONFIG) ? TS_TYPES_CONFIG : TS_CONFIG,
    skipAddingFilesFromTsConfig: true,
  })

  const sourceFiles: SourceFile[] = []
  await Promise.all(
    files.map(async (file: string) => {
      if (isSFC(file)) {
        // 对于 vue 文件，借助 @vue/compiler-sfc 的 parse 进行解析
        const sfc = parse(await fs.promises.readFile(file, 'utf-8'))
        // 提取出 script 中的内容
        const { script, scriptSetup } = sfc.descriptor

        if (script || scriptSetup) {
          let content = ''
          let isTs = false

          if (script && script.content) {
            content += script.content

            if (getIsTs(script.lang)) isTs = true
          }

          if (scriptSetup) {
            const compiled = compileScript(sfc.descriptor, {
              id: `${index++}`,
            })

            content += compiled.content

            if (getIsTs(scriptSetup.lang)) isTs = true
          }

          sourceFiles.push(
            // 创建一个同路径的同名 ts/js 的映射文件
            project.createSourceFile(file + (isTs ? '.ts' : '.js'), content)
          )
        }
      } else if (isScript(file)) {
        // 如果是 ts 文件则直接添加即可
        sourceFiles.push(project.addSourceFileAtPath(file))
      }
    })
  )
  // const diagnostics = project.getPreEmitDiagnostics()

  // // 输出解析过程中的错误信息
  // console.log(project.formatDiagnosticsWithColorAndContext(diagnostics))

  project.emitToMemory()

  // 随后将解析完的文件写道打包路径
  for (const sourceFile of sourceFiles) {
    const emitOutput = sourceFile.getEmitOutput()

    for (const outputFile of emitOutput.getOutputFiles()) {
      const filePath = outputFile.getFilePath()

      await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
      await fs.promises.writeFile(filePath, outputFile.getText(), 'utf8')
    }
  }
}

async function getAllComipleDtsFiles(dir: string, files: string[] = []) {
  const entryDir = await readdir(dir)
  await Promise.all(
    entryDir.map(async (filename) => {
      const file = resolve(dir, filename)
      if ([EXAMPLE_DIR_NAME, DOCS_DIR_NAME, TESTS_DIR_NAME, STYLE_DIR_NAME].includes(filename)) return
      if (isDir(file)) {
        await getAllComipleDtsFiles(file, files)
      } else {
        if (isDTS(file)) return
        if (!isSFC(file) && !isScript(file)) return
        files.push(file)
      }
    })
  )
  return files
}

export async function compileModuleTypes() {
  const files: string[] = await getAllComipleDtsFiles(SRC_DIR)
  await compileDts(files)
}

async function comipleTypesEntry() {
  const config = getSmyConfig()
  const namespace = config.namespace
  const { name, version } = require(UI_PACKAGE_JSON)
  const entryDir = await readdir(SRC_DIR)
  const exports: string[] = []
  const declares: string[] = []

  entryDir.forEach((filename) => {
    const file = resolve(SRC_DIR, filename)
    if (!isDir(file)) return
    if (filename.startsWith('_')) return
    if (!isPublicDir(file)) return
    const componentName = upperFirst(camelCase(filename))
    const upperComponentName = `${upperFirst(namespace)}${componentName}`
    exports.push(`export { default as ${componentName} } from './${filename}'`)
    declares.push(`${upperComponentName}: typeof import('${name}')['${componentName}']`)
  })
  const template = `\
import type { VueConstructor } from 'vue'

export declare function install(app: VueConstructor): void

export declare const version = "${version}";

${exports.join('\n')}

declare const _default: {
  install: typeof install;
  version: typeof version;
}

export default _default
`

  const globalTemplate = `\
declare module 'vue' {
  export interface GlobalComponents {
    ${declares.join('\n    ')}
  }
}

export {}
`
  await Promise.all([
    writeFile(resolve(TYPES_DIR, 'index.d.ts'), template),
    writeFile(resolve(TYPES_DIR, 'global.d.ts'), globalTemplate),
  ])
}
