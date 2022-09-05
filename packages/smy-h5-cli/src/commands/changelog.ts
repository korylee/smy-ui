import ora from 'ora'
import conventionalChangelog from 'conventional-changelog'
import { CWD } from '../shared/constant'
import { resolve as resolvePath } from 'path'
import { createWriteStream } from 'fs-extra'

interface ChanglogCommandOptions {
  file?: string
  releaseCount?: number
}

export function changelog({ releaseCount = 0, file = 'CHANGELOG.md' }: ChanglogCommandOptions): Promise<void> {
  const s = ora().start('Generating changelog')
  return new Promise((resolve) => {
    conventionalChangelog({
      preset: 'angular',
      releaseCount,
    })
      .pipe(createWriteStream(resolvePath(CWD, file)))
      .on('close', () => {
        s.succeed(`Changelog generated success!`)
        resolve()
      })
  })
}
