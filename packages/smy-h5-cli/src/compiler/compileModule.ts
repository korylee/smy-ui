import { copy, readdir, removeSync } from 'fs-extra'
import { build } from 'vite'
import { getESMBundleConfig } from '../config'
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
import { getPublicDirs, isDir, isDTS, isLess, isScript, isSFC } from '../shared/fs-utils'
import { compileSFCFile } from './compileSFC'
import { compileESEntry, compileScriptFile } from './compileScript'
import { compileLess } from './compileStyle'
import { generateReference } from './compileTypes'

export async function compileModule(moduleType: 'umd' | 'esm' | 'commonjs' | boolean = false) {
  if (moduleType === 'esm') {
    return await compileESMBundle()
  }

  const isCjs = moduleType === 'commonjs'
  process.env.BABEL_MODULE = isCjs ? 'commonjs' : 'module'
  const dest = isCjs ? LIB_DIR : ES_DIR
  await copy(SRC_DIR, dest)
  const moduleDir: string[] = await readdir(dest)

  await Promise.all(
    moduleDir.map((filename: string) => {
      const file: string = resolve(dest, filename)
      return isDir(file) ? compileDir(file) : null
    })
  )
  const publicDirs = await getPublicDirs()

  await (isCjs ? console.log(dest) : compileESEntry(dest, publicDirs))
  generateReference(dest)
}

export function compileESMBundle() {
  const config = getESMBundleConfig(getSmyConfig())
  return build(config)
    .then(() => Promise.resolve())
    .catch(() => Promise.reject())
}

export async function compileDir(dir: string) {
  const dirs = await readdir(dir)
  await Promise.all(
    dirs.map((filename) => {
      const file = resolve(dir, filename)

      ;[EXAMPLE_DIR_NAME, DOCS_DIR_NAME, TESTS_DIR_NAME].includes(filename) && removeSync(file)
      if (isDTS(file) || filename === STYLE_DIR_NAME) return
      return compileFile(file)
    })
  )
}

export async function compileFile(file: string) {
  isSFC(file) && (await compileSFCFile(file))
  isScript(file) && (await compileScriptFile(file))
  isLess(file) && (await compileLess(file))
  isDir(file) && (await compileDir(file))
}
