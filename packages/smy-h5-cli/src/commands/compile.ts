import { remove } from 'fs-extra'
import { ES_DIR } from '../shared/constant'
import ora from 'ora'
import { compileModule } from '../compiler/compileModule'
import logger from '../shared/logger'
import { compileTypes } from '../compiler/compileTypes'

export function removeDir() {
  return Promise.all([remove(ES_DIR)])
}

export async function runTask(taskName: string, task: () => any) {
  const progress = ora().start(`Compiling ${taskName}`)
  try {
    await task()
    progress.succeed(`Compilation ${taskName} completed!`)
  } catch (e: any) {
    progress.fail(`Compilation ${taskName} failed!`)
    logger.error(e.toString())
  }
}

export async function compile(cmd: { onUmd: boolean }) {
  process.env.NODE_ENV = 'compile'

  await removeDir()
  await Promise.all([runTask('types', compileTypes)])
  await runTask('module', compileModule)
  await runTask('commonjs', () => compileModule('commonjs'))
}
