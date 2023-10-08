import { copy, readdir, remove } from 'fs-extra'
import { build } from 'vite'
import { getSmyConfig } from '../config/smyConfig'
import {
  DOCS_DIR_NAME,
  ES_DIR,
  EXAMPLE_DIR_NAME,
  LIB_DIR,
  SRC_DIR,
  STYLE_DIR_NAME,
  TESTS_DIR_NAME,
  UMD_DIR,
} from '../shared/constant'
import { resolve } from 'path'
import { isDir, isDTS, isLess, isPublicDir, isScript, isSFC } from '../shared/fs-utils'
import { compileSFCFile } from './compileSFC'
import { compileESEntry, compileScriptFile } from './compileScript'
import { compileLess } from './compileStyle'
import { comipleDtsEntry, compileDts } from './compileTypes'
import { kebabCase } from 'lodash'
import { BundleBuildOptions, getBundleConfig } from '../config/viteConfig'

export async function compileBundle() {
  const smyConfig = await getSmyConfig()
  const name = kebabCase(smyConfig.name)
  const buildOptions: BundleBuildOptions[] = [
    {
      format: 'es',
      fileName: `${name}.esm.js`,
      output: ES_DIR,
      emptyOutDir: false,
      removeEnv: true,
    },
    {
      format: 'cjs',
      fileName: `${name}.cjs.js`,
      output: LIB_DIR,
      emptyOutDir: false,
      removeEnv: false,
    },
    {
      format: 'umd',
      fileName: `${name}.js`,
      output: UMD_DIR,
      emptyOutDir: true,
      removeEnv: true,
    },
  ]
  const tasks = buildOptions.map((options) => build(getBundleConfig(smyConfig, options)))
  await Promise.all(tasks)
}

export async function compileModule() {
  const moduleDir: string[] = await readdir(SRC_DIR)
  const publicDirs = moduleDir.filter((filename: string) => isPublicDir(resolve(SRC_DIR, filename)))

  const dest = ES_DIR
  await copy(SRC_DIR, dest)
  const files = await getAllCompileFiles(dest)

  await Promise.all([compileDts(files), comipleDtsEntry(dest, publicDirs)])
  await Promise.all(files.map((file) => compileFile(file)))

  await compileESEntry(dest, publicDirs)
}

async function getAllCompileFiles(dir: string, files: string[] = []) {
  const entryDir = await readdir(dir)
  await Promise.all(
    entryDir.map(async (filename) => {
      const file = resolve(dir, filename)
      if ([EXAMPLE_DIR_NAME, DOCS_DIR_NAME, TESTS_DIR_NAME, STYLE_DIR_NAME].includes(filename)) {
        return await remove(file)
      }
      if (isDir(file)) {
        return await getAllCompileFiles(file, files)
      }
      if (isDTS(file) || filename === STYLE_DIR_NAME) return
      files.push(file)
    })
  )
  return files
}

export async function compileFile(file: string) {
  isSFC(file) && (await compileSFCFile(file))
  isScript(file) && (await compileScriptFile(file))
  isLess(file) && (await compileLess(file))
}
