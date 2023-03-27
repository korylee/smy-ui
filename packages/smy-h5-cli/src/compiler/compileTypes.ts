import type { SourceFile } from 'ts-morph'

import { ensureDir, pathExistsSync, readdir, writeFile } from 'fs-extra'
import { getSmyConfig } from '../config/smyConfig'
import { UI_PACKAGE_JSON, TS_CONFIG, TS_TYPES_CONFIG, SRC_DIR, TYPES_DIR } from '../shared/constant'
import { resolve, dirname } from 'path'
import { camelCase, upperFirst } from 'lodash'
const fs = require('fs')
const { Project } = require('ts-morph')
const { parse, compileScript } = require('@vue/compiler-sfc')
import { isDir, isPublicDir, isScript, isSFC } from '../shared/fs-utils'

export async function compileTypes() {
  await ensureDir(TYPES_DIR)
  await comipleTypes()
}

let index = 1

const getIsTs = (str: string) => ['ts', 'tsx'].includes(str)

export async function compileDts(files: string[], outDir = TYPES_DIR) {
  // 这部分内容具体可以查阅 ts-morph 的文档
  // 这里仅需要知道这是用来处理 ts 文件并生成类型声明文件即可
  const project = new Project({
    compilerOptions: {
      declaration: true,
      emitDeclarationOnly: true,
      noEmitOnError: true,
      allowJs: true, // 如果想兼容 js 语法需要加上
      outDir, // 可以设置自定义的打包文件夹，如 'types'
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
  const diagnostics = project.getPreEmitDiagnostics()

  const errorLog = project.formatDiagnosticsWithColorAndContext(diagnostics)
  // 输出解析过程中的错误信息
  errorLog && console.log(errorLog)

  project.emitToMemory()

  // 随后将解析完的文件写道打包路径
  for (const sourceFile of sourceFiles) {
    const emitOutput = sourceFile.getEmitOutput()

    await Promise.all(
      emitOutput.getOutputFiles().map(async (outputFile) => {
        const filePath = outputFile.getFilePath()

        await fs.promises.mkdir(dirname(filePath), { recursive: true })
        await fs.promises.writeFile(filePath, outputFile.getText(), 'utf8')
      })
    )
  }
}

export async function comipleDtsEntry(dest: string, publicDirs: string[]) {
  const { version } = require(UI_PACKAGE_JSON)
  const exports: string[] = []
  publicDirs.forEach((filename) => {
    if (filename.startsWith('_')) return
    const componentName = upperFirst(camelCase(filename))
    exports.push(`export { default as ${componentName} } from './${filename}'`)
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
  await writeFile(resolve(dest, 'index.d.ts'), template)
}

async function comipleTypes() {
  const config = getSmyConfig()
  const namespace = config?.namespace ?? 'smy'
  const { name } = require(UI_PACKAGE_JSON)
  const entryDir = await readdir(SRC_DIR)
  const declares: string[] = []

  entryDir.forEach((filename) => {
    const file = resolve(SRC_DIR, filename)
    if (!isDir(file)) return
    if (!isPublicDir(file) || filename.startsWith('_')) return
    const componentName = upperFirst(camelCase(filename))
    const upperComponentName = `${upperFirst(namespace)}${componentName}`
    declares.push(`${upperComponentName}: typeof import('${name}')['${componentName}']`)
  })

  const globalTemplate = `\
interface AllModules {
  ${declares.join('\n  ')}
}

declare module 'vue' {
  type ExtractComponent<T> = T extends { Component?: infer S } ? (S extends void ? T : S) : T
  type DirectiveKeys<T> = {
    [K in keyof T]: T[K] extends import('vue').DirectiveOptions ? K : never
  }[keyof T]

  export type GlobalDirectives = Pick<AllModules, DirectiveKeys<AllModules>>
  export type GlobalComponents = {
    [P in Exclude<keyof AllModules, DirectiveKeys<AllModules>>]: ExtractComponent<AllModules[P]>
  }
}

export {}
`
  await writeFile(resolve(TYPES_DIR, 'global.d.ts'), globalTemplate)
}
