import { remove } from 'fs-extra'
import { ES_DIR, HL_DIR, LIB_DIR, TYPES_DIR } from '../shared/constant'
import { compileBundle, compileModule } from '../compiler/compileModule'
import logger from '../shared/logger'
import { compileTypes } from '../compiler/compileTypes'
import { compileTemplateHighlight } from '../compiler/compileTemplateHighLight'
import { createSpinner } from 'nanospinner'

function removeDir() {
  return Promise.all([remove(ES_DIR), remove(TYPES_DIR), remove(HL_DIR), remove(LIB_DIR)])
}

export async function runTask(taskName: string, task: () => any) {
  const progress = createSpinner().start({ text: `Compiling ${taskName}` })
  try {
    const start = performance.now()
    await task()
    progress.success({ text: `Compilation ${taskName} completed! (${Math.ceil(performance.now() - start)}ms)` })
  } catch (e: any) {
    progress.error({ text: `Compilation ${taskName} failed!` })
    logger.error(e.toString())
  }
}

export async function compile() {
  process.env.NODE_ENV = 'compile'

  await removeDir()
  await Promise.all([runTask('types', compileTypes), runTask('template highlight', compileTemplateHighlight)])

  process.env.BABEL_MODULE = 'module'
  await runTask('module', compileModule)

  process.env.BABEL_MODULE = ''
  await runTask('bundle', compileBundle)
}
