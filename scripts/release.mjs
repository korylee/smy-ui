import { updateVersion, publish } from '@smy-h5/cli'
import { createSpinner } from 'nanospinner'

async function runTask(taskName, task) {
  const s = createSpinner().start({ text: `${taskName} start` })
  try {
    await task()
    s.success({ text: `Task ${taskName} completed!` })
  } catch (e) {
    s.error({ text: `Task ${taskName} failed!` })
    console.error(e.toString())
  }
}

;(async () => {
  const inputs = process.argv.slice(2)
  const pkgs = inputs.length ? inputs : ['shared', 'cli', 'icons', 'ui', 'repl']
  await runTask('update-version', updateVersion)
  await runTask('build-all', () => {
    import('./build.mjs')
  })
  await runTask('publish', () => {
    publish(pkgs)
  })
})()
