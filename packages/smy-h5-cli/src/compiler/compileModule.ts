import { copy, readdir, remove, removeSync } from 'fs-extra'
import { build } from 'vite'
import { getESMBundleConfig, getUMDCOnfig } from '../config'
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
import { compileDts } from './compileTypes'

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
  const publicDirs = moduleDir.filter(
    (filename: string) => isPublicDir(resolve(SRC_DIR, filename)) && !filename.startsWith('_')
  )

  const dest = isCjs ? LIB_DIR : ES_DIR
  await copy(SRC_DIR, dest)
  await remove(resolve(SRC_DIR, 'index.d.ts'))

  await Promise.all(
    moduleDir.map((filename: string) => {
      const file: string = resolve(dest, filename)
      return isDir(file) ? compileDir(file) : null
    })
  )

  await (isCjs ? compileCommonJSEntry(dest, publicDirs) : compileESEntry(dest, publicDirs))
}

export function compileUMD() {
  const config = getUMDCOnfig(getSmyConfig())
  return build(config)
    .then(() => Promise.resolve())
    .catch(() => Promise.reject())
}

export function compileESMBundle() {
  const config = getESMBundleConfig(getSmyConfig())
  return build(config)
    .then(() => Promise.resolve())
    .catch(() => Promise.reject())
}

export async function compileDir(dir: string) {
  const dirs = await readdir(dir)
  const files: string[] = []
  dirs.forEach((filename) => {
    const file = resolve(dir, filename)
    const uncompileFiles = [EXAMPLE_DIR_NAME, DOCS_DIR_NAME, TESTS_DIR_NAME]
    if (uncompileFiles.includes(filename)) {
      removeSync(file)
      return
    }
    if (isDTS(file) || filename === STYLE_DIR_NAME) return
    files.push(file)
  })

  const compileDtsFiles = files.filter((file) => isSFC(file) || isScript(file))
  await compileDts(compileDtsFiles)
  return Promise.all(files.map((file) => compileFile(file)))
}

export async function compileFile(file: string) {
  isSFC(file) && (await compileSFCFile(file))
  isScript(file) && (await compileScriptFile(file))
  isLess(file) && (await compileLess(file))
  isDir(file) && (await compileDir(file))
}
