import execa from 'execa'
import { resolve } from 'path'
import { CWD, ESLINT_EXTENSIONS } from '../shared/constant'
import { isDir } from '../shared/fs-utils'
import { createSpinner } from 'nanospinner'

export async function lint() {
  const spinner = createSpinner()
  try {
    spinner.start({ text: 'prettier starting...' })
    await execa('prettier', ['--write', '.'])
    spinner.success({ text: 'prettier success' })

    spinner.start({ text: 'eslint starting...' })
    const eslintPatterns: string[] = [
      './src',
      './packages/smy-h5-cli/src',
      './packages/smy-h5-ui/src',
      './packages/smy-h5-markdown-vite-plugin',
    ]
    const { stdout } = await execa('eslint', [
      ...eslintPatterns.filter((pattern) => isDir(resolve(CWD, pattern))),
      '--fix',
      '--ext',
      ESLINT_EXTENSIONS.join(),
    ])
    if (stdout) {
      spinner.warn({ text: stdout })
      return
    }
    spinner.success({ text: 'eslint success' })
  } catch (e: any) {
    spinner.error({ text: e.toString() })
    process.exit(1)
  }
}
