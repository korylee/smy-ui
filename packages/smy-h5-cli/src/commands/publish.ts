import execa from 'execa'
import { UI_PACKAGE_JSON } from '../shared/constant'
import logger from '../shared/logger'
import { changelog } from './changelog'
import { createSpinner } from 'nanospinner'

async function doPublish(packages: string[] | undefined, preRelease: boolean) {
  const s = createSpinner().start({ text: 'Publishing all packages' })
  const args = ['-r', 'publish', '--no-git-checks', '--access', 'public']
  // 过滤某些包，或者可以使用--filter=xxx --filter=!xxx
  packages?.forEach((pkg) => {
    args.push('--filter', pkg)
  })
  preRelease && args.push('--tag', 'alpha')
  const ret = await execa('pnpm', args)
  if (ret.stderr && ret.stderr.includes('npm ERR!')) {
    throw new Error('\n' + ret.stderr)
  } else {
    s.success({ text: 'Publish all packages successfully' })
    ret.stdout && logger.info(ret.stdout)
  }
}

async function pushGit(version: string, remote = 'origin') {
  const s = createSpinner().start({ text: `Pushing to remote git repository` })
  await execa('git', ['add', '.'])
  await execa('git', ['commit', '-m', `v${version}`])
  await execa('git', ['tag', `v${version}`])
  await execa('git', ['push', remote, `v${version}`])
  const ret = await execa('git', ['push'])
  s.success({ text: 'Push remote repository successfully' })
  ret.stdout && logger.info(ret.stdout)
}

export async function publish(packages?: string[], cmd: { remote?: string } = {}) {
  try {
    const version = require(UI_PACKAGE_JSON).version
    const isPreRelease = version.includes('alpha')

    if (!isPreRelease) {
      await changelog()
      await pushGit(version, cmd.remote)
    }

    await doPublish(packages, isPreRelease)

    if (isPreRelease) {
      try {
        await execa('git', ['restore', '**/package.json'])
        await execa('git', ['restore', 'package.json'])
      } catch (e) {
        logger.error(`Restore package.json has failed, please restoree manually`)
      }
    }
    logger.success(`Release version ${version} successfuly!`)
  } catch (e: any) {
    logger.error(e.toString())
    process.exit(1)
  }
}
