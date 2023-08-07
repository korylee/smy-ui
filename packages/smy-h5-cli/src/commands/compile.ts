import { remove } from 'fs-extra'
import { ES_DIR, HL_DIR, LIB_DIR, TYPES_DIR, UMD_DIR } from '../shared/constant'
import ora from 'ora'
import { compileBundle, compileModule } from '../compiler/compileModule'
import logger from '../shared/logger'

export function removeDir() {
  return Promise.all([remove(ES_DIR), remove(TYPES_DIR), remove(LIB_DIR), remove(UMD_DIR), remove(HL_DIR)])
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

export async function compile() {
  process.env.NODE_ENV = 'compile'

  await removeDir()
  // await Promise.all([runTask('types', compileTypes), runTask('template highlight', compileTemplateHighlight)])
  process.env.NODE_ENV = 'module'

  await runTask('module', compileModule)
  process.env.NODE_ENV = ''
  await runTask('bundle', compileBundle)
}
