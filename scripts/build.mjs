import { resolve } from 'path'
import execa from 'execa'
import { createSpinner } from 'nanospinner'

const CWD = process.cwd()
const PKG_CLI = resolve(CWD, './packages/smy-h5-cli')
const PKG_UI = resolve(CWD, './packages/smy-h5-ui')
const PKG_ICONS = resolve(CWD, './packages/smy-h5-icons')
const PKG_CODE_VIEW = resolve(CWD, './packages/smy-h5-code-view')

export const buildCli = () => execa('pnpm', ['build'], { cwd: PKG_CLI })
export const buildIcons = () => execa('pnpm', ['build'], { cwd: PKG_ICONS })
export const buildUi = () => execa('pnpm', ['compile'], { cwd: PKG_UI })
export const buildCodeView = () => execa('pnpm', ['build'], { cwd: PKG_CODE_VIEW })

export async function runTask(taskName, task) {
  const s = createSpinner().start({ text: `Building ${taskName}` })
  try {
    await task()
    s.success({ text: `Build ${taskName} completed!` })
  } catch (e) {
    s.error({ text: `Build ${taskName} failed!` })
    console.error(e.toString())
  }
}

;(async () => {
  await runTask('cli', buildCli)
  await runTask('icons', buildIcons)
  await runTask('ui', buildUi)
  await runTask('code-view', buildCodeView)
})()
