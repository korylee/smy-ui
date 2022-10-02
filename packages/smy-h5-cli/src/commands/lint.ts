import execa from 'execa'
import ora, { Ora } from 'ora'

export async function lint() {
  let spinner: Ora
  try {
    spinner = ora('prettier starting...').start()
    await execa('prettier', ['--write', '.'])
    spinner.succeed('prettier success')
  } catch (e: any) {
    spinner!.fail(e.toString())
    process.exit(1)
  }
}
