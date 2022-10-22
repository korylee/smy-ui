import { appendFileSync, ensureFileSync, lstatSync, outputFileSync, pathExistsSync, readFileSync } from 'fs-extra'
import { extname, resolve } from 'path'
import { PUBLIC_DIR_INDEXES, SCRIPTS_EXTENSIONS } from './constant'
import globSync from 'glob'

export const isDir = (file: string): boolean => pathExistsSync(file) && lstatSync(file).isDirectory()

export const isSFC = (file: string): boolean => pathExistsSync(file) && extname(file) === '.vue'

export const isDTS = (file: string): boolean => pathExistsSync(file) && file.endsWith('.d.ts')

export const isLess = (file: string): boolean => pathExistsSync(file) && extname(file) === '.less'

export const isScript = (file: string): boolean => pathExistsSync(file) && SCRIPTS_EXTENSIONS.includes(extname(file))

export const replaceExt = (file: string, ext: string): string => file.replace(extname(file), ext)

export const isPublicDir = (dir: string): boolean =>
  PUBLIC_DIR_INDEXES.some((index) => pathExistsSync(resolve(dir, index)))

export function smartAppendFileSync(file: string, code: string, force = true) {
  if (!pathExistsSync(file)) {
    if (!force) return
    ensureFileSync(file)
  }
  const content = readFileSync(file, 'utf-8')
  if (!content.includes(code)) {
    appendFileSync(file, code)
  }
}

export function outputFileSyncOnChange(path: string, code: string) {
  ensureFileSync(path)
  const content = readFileSync(path, 'utf-8')
  if (content === code) return
  outputFileSync(path, code)
}

export function glob(pattern: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    globSync(pattern, (err: any, files: string[]) => {
      if (err) reject(err)
      else resolve(files)
    })
  })
}
