import execa from 'execa'
import ora, { Ora } from 'ora'
import { resolve } from 'path'
import { CWD, ESLINT_EXTENSIONS } from '../shared/constant'
import { isDir } from '../shared/fs-utils'

export async function lint() {
  let spinner: Ora
  try {
    spinner = ora('prettier starting...').start()
    await execa('prettier', ['--write', '.'])
    spinner.succeed('prettier success')

    spinner = ora('eslint starting...').start()
    const eslintPatterns: string[] = ['./src', './packages/varlet-markdown-vite-plugin']
    const { stdout } = await execa('eslint', [
      ...eslintPatterns.filter((pattern) => isDir(resolve(CWD, pattern))),
      '--fix',
      '--ext',
      ESLINT_EXTENSIONS.join(),
    ])
    if (stdout) {
      spinner.warn(stdout)
      return
    }
    spinner.succeed('eslint success')
  } catch (e: any) {
    spinner!.fail(e.toString())
    process.exit(1)
  }
}
