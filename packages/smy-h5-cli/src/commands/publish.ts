import execa from 'execa'
import { UI_PACKAGE_JSON } from '../shared/constant'
import logger from '../shared/logger'
import { changelog } from './changelog'
import ora from 'ora'

const ReleasePackages = ['ui', 'vtools']

async function doPublish(preRelease: boolean) {
  const s = ora().start('Publishing all packages')
  const args = ['-r', 'publish', '--no-git-checks', '--access', 'public']
  // 过滤某些包，或者可以使用--filter=xxx --filter=!xxx
  ReleasePackages.forEach((pkg) => {
    args.push('--filter', pkg)
  })
  preRelease && args.push('--tag', 'alpha')
  const ret = await execa('pnpm', args)
  if (ret.stderr && ret.stderr.includes('npm ERR!')) {
    throw new Error('\n' + ret.stderr)
  } else {
    s.succeed('Publish all packages successfully')
    ret.stdout && logger.info(ret.stdout)
  }
}

async function pushGit(version: string, remote = 'origin') {
  const s = ora().start(`Pushing to remote git repository`)
  await execa('git', ['add', '.'])
  await execa('git', ['commit', '-m', `v${version}`])
  await execa('git', ['tag', `v${version}`])
  await execa('git', ['push', remote, `v${version}`])
  const ret = await execa('git', ['push'])
  s.succeed('Push remote repository successfully')
  ret.stdout && logger.info(ret.stdout)
}

export async function publish(cmd: { remote?: string }) {
  try {
    const version = require(UI_PACKAGE_JSON).version
    const isPreRelease = version.includes('alpha')

    if (!isPreRelease) {
      await changelog()
      await pushGit(version, cmd.remote)
    }

    await doPublish(isPreRelease)

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
