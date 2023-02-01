import { copy, readdir, remove, removeSync } from 'fs-extra'
import { build } from 'vite'
import { getESMBundleConfig, getUMDConfig } from '../config'
import { getSmyConfig } from '../config/getConfig'
import {
  DOCS_DIR_NAME,
  ES_DIR,
  EXAMPLE_DIR_NAME,
  LIB_DIR,
  SRC_DIR,
  STYLE_DIR_NAME,
  TESTS_DIR_NAME,
} from '../shared/constant'
import { resolve } from 'path'
import { isDir, isDTS, isLess, isPublicDir, isScript, isSFC } from '../shared/fs-utils'
import { compileSFCFile } from './compileSFC'
import { compileCommonJSEntry, compileESEntry, compileScriptFile } from './compileScript'
import { compileLess } from './compileStyle'
import { comipleDtsEntry, compileDts } from './compileTypes'

export async function compileModule(moduleType: 'umd' | 'esm' | 'commonjs' | boolean = false) {
  if (moduleType === 'umd') {
    return await compileUMD()
  }
  if (moduleType === 'esm') {
    return await compileESMBundle()
  }

  const isCjs = moduleType === 'commonjs'
  process.env.BABEL_MODULE = isCjs ? 'commonjs' : 'module'

  const moduleDir: string[] = await readdir(SRC_DIR)
  const publicDirs = moduleDir.filter((filename: string) => isPublicDir(resolve(SRC_DIR, filename)))

  const dest = isCjs ? LIB_DIR : ES_DIR
  await copy(SRC_DIR, dest)
  const files = await getAllCompileFiles(dest)

  await Promise.all([compileDts(files, dest), comipleDtsEntry(dest, publicDirs)])
  await Promise.all(files.map((file) => compileFile(file)))

  if (isCjs) {
    await compileCommonJSEntry(dest, publicDirs)
  } else {
    await compileESEntry(dest, publicDirs)
  }
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
