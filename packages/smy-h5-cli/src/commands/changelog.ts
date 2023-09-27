import conventionalChangelog from 'conventional-changelog'
import { CWD } from '../shared/constant'
import { resolve as resolvePath } from 'path'
import { createWriteStream } from 'fs-extra'
import { createSpinner } from 'nanospinner'

interface ChangelogCommandOptions {
  file?: string
  releaseCount?: number
}

export function changelog({ releaseCount = 0, file = 'CHANGELOG.md' }: ChangelogCommandOptions = {}): Promise<void> {
  const s = createSpinner().start({ text: 'Generating changelog' })
  return new Promise((resolve) => {
    conventionalChangelog({
      preset: 'angular',
      releaseCount,
    })
      .pipe(createWriteStream(resolvePath(CWD, file)))
      .on('close', () => {
        s.success({ text: `Changelog generated success!` })
        resolve()
      })
  })
}
