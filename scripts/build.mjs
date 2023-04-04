import { resolve } from 'path'
import execa from 'execa'
import ora from 'ora'

const CWD = process.cwd()
const PKG_CLI = resolve(CWD, './packages/smy-h5-cli')
const PKG_UI = resolve(CWD, './packages/smy-h5-ui')
const PKG_ICONS = resolve(CWD, './packages/smy-h5-icons')

export const buildCli = () => execa('pnpm', ['build'], { cwd: PKG_CLI })
export const buildIcons = () => execa('pnpm', ['build'], { cwd: PKG_ICONS })
export const buildUi = (noUmd) => execa('pnpm', ['compile', noUmd ? '--noUmd' : ''], { cwd: PKG_UI })

export async function runTask(taskName, task) {
  const s = ora().start(`Building ${taskName}`)
  try {
    await task()
    s.succeed(`Build ${taskName} completed!`)
  } catch (e) {
    s.fail(`Build ${taskName} failed!`)
    console.error(e.toString())
  }
}

;(async () => {
  await runTask('cli', buildCli)
  await runTask('icons', buildIcons)
  await runTask('ui', () => buildUi(true))
})()
