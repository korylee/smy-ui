import { remove } from 'fs-extra'
import { ES_DIR, LIB_DIR, TYPES_DIR } from '../shared/constant'
import ora from 'ora'
import { compileModule } from '../compiler/compileModule'
import logger from '../shared/logger'
import { compileTypes } from '../compiler/compileTypes'
import { compileTemplateHighlight } from '../compiler/compileTemplateHighLight'

export function removeDir() {
  return Promise.all([remove(ES_DIR), remove(TYPES_DIR), remove(LIB_DIR)])
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

export async function compile(cmd: { noUmd: boolean }) {
  process.env.NODE_ENV = 'compile'

  await removeDir()
  await Promise.all([runTask('types', compileTypes), runTask('template highlight', compileTemplateHighlight)])
  await runTask('module', compileModule)
  await runTask('commonjs', () => compileModule('commonjs'))
  !cmd.noUmd && (await runTask('umd', () => compileModule('umd')))

  process.env.BABEL_MODULE = ''
  await runTask('bundle', () => compileModule('esm'))
}
