import { copy, readdir, removeSync } from 'fs-extra'
import { build } from 'vite'
import { getESMBundleConfig, getUMDConfig } from '../config'
import { getSmyConfig } from '../config/smyConfig'
import { DOCS_DIR_NAME, ES_DIR, EXAMPLE_DIR_NAME, SRC_DIR, STYLE_DIR_NAME, TESTS_DIR_NAME } from '../shared/constant'
import { resolve } from 'path'
import { isDir, isDTS, isLess, isPublicDir, isScript, isSFC } from '../shared/fs-utils'
import { compileSFCFile } from './compileSFC'
import { compileESEntry, compileScriptFile } from './compileScript'
import { compileLess } from './compileStyle'
import { comipleDtsEntry, compileDts } from './compileTypes'
import { kebabCase } from 'lodash'
import { BundleBuildOptions, getBundleConfig } from '../config/viteConfig'

export async function compileBundle() {
  const smyConfig = getSmyConfig()
  const name = kebabCase(smyConfig.name)
  const buildOptions: BundleBuildOptions[] = [
    {
      format: 'es',
      filename: `${name}.esm.js`,
      output: ES_DIR,
      emptyOutDir: false,
    },
  ]
  const tasks = buildOptions.map((options) => build(getBundleConfig(smyConfig, options)))
  return await Promise.all(tasks)
}

export async function compileModule() {
  const dest = ES_DIR
  await copy(SRC_DIR, dest)
  const moduleDir: string[] = await readdir(dest)
  const publicDirs = moduleDir.filter((filename: string) => isPublicDir(resolve(SRC_DIR, filename)))

  const files = await getAllCompileFiles(dest)

  await Promise.all([compileDts(files, dest), comipleDtsEntry(dest, publicDirs)])
  await Promise.all(files.map((file) => compileFile(file)))

  await compileESEntry(dest, publicDirs)
}

async function getAllCompileFiles(dir: string, files: string[] = []) {
  const entryDir = await readdir(dir)
  await Promise.all(
    entryDir.map(async (filename) => {
      const file = resolve(dir, filename)
      if ([EXAMPLE_DIR_NAME, DOCS_DIR_NAME, TESTS_DIR_NAME, STYLE_DIR_NAME].includes(filename)) {
        return removeSync(file)
      }
      if (isDir(file)) return await getAllCompileFiles(file, files)
      else if (isDTS(file) || filename === STYLE_DIR_NAME) return
      else files.push(file)
    })
  )
  return files
}

export function compileUMD() {
  const config = getUMDConfig(getSmyConfig())
  return build(config)
    .then(() => Promise.resolve())
    .catch((err) => Promise.reject(err))
}

export function compileESMBundle() {
  const config = getESMBundleConfig(getSmyConfig())
  return build(config)
    .then(() => Promise.resolve())
    .catch((err) => Promise.reject(err))
}

export async function compileFile(file: string) {
  isSFC(file) && (await compileSFCFile(file))
  isScript(file) && (await compileScriptFile(file))
  isLess(file) && (await compileLess(file))
}
