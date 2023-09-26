import { existsSync, renameSync, unlinkSync } from 'node:fs'
import { resolve } from 'node:path'

const CWD = process.cwd()

const iifeFile = resolve(CWD, './iife.js')
const globalFile = resolve(CWD, './index.global.js')

existsSync(iifeFile) && unlinkSync(iifeFile)
existsSync(globalFile) && renameSync(globalFile, iifeFile)
