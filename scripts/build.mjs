import { resolve } from 'path'
import execa from 'execa'
import ora from 'ora'

const CWD = process.cwd()
const PKG_CLI = resolve(CWD, './packages/smy-h5-cli')
const PKG_UI = resolve(CWD, './packages/smy-h5-ui')
const PKG_VTOOLS = resolve(CWD, './packages/smy-h5-vtools')

export const buildCli = () => execa('pnpm', ['build'], { cwd: PKG_CLI })
export const buildUi = (noUmd) => execa('pnpm', ['compile', noUmd ? '--noUmd' : ''], { cwd: PKG_UI })
export const buildVtools = () => execa('pnpm', ['build'], { cwd: PKG_VTOOLS })

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
  await runTask('vtools', buildVtools)
  await runTask('ui', () => buildUi(false))
})()
