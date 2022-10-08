import execa from 'execa'
import inquirer from 'inquirer'
import semver from 'semver'
import { CWD, UI_PACKAGE_JSON } from '../shared/constant'
import logger from '../shared/logger'
import glob from 'glob'
import { resolve } from 'path'
import { writeFileSync } from 'fs-extra'
import { changelog } from './changelog'
import ora from 'ora'

// 不懂看这 https://www.jianshu.com/p/5565536a1f82
const releaseTypes = ['premajor', 'major', 'prepatch', 'patch', 'preminor', 'minor']

async function isWorktreeEmpty() {
  const ret = await execa('git', ['status', '--porcelain'])
  return !ret.stdout
}

async function publish(preRelease: boolean) {
  const s = ora().start('Publishing all packages')
  const args = ['-r', 'publish', '--no-git-checks', '--access', 'publish']
  preRelease && args.push('--tag', 'alpha')
  const ret = await execa('pnpm', args)
  if (ret.stderr && ret.stderr.includes('npm ERR!')) {
    throw new Error('\n' + ret.stderr)
  } else {
    s.succeed('Publish all packages successfully')
    ret.stdout && logger.info(ret.stdout)
  }
}

function updateVersion(version: string) {
  const packageJsons = glob.sync('packages/*/package.json')
  packageJsons.push('package.json')

  packageJsons.forEach((path: string) => {
    const file = resolve(CWD, path)
    const config = require(file)

    config.version = version
    writeFileSync(file, JSON.stringify(config, null, 2))
  })
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

export async function release(cmd: { remote?: string }) {
  try {
    const currentVersion = require(UI_PACKAGE_JSON).version
    if (!currentVersion) {
      logger.error('Your Package is missing the verison field')
      return
    }
    if (!(await isWorktreeEmpty())) {
      logger.error('Git worktree is not empty, please commit changed')
      return
    }
    let name = 'Please select release type'
    const ret = await inquirer.prompt([
      {
        name,
        type: 'list',
        choices: releaseTypes,
      },
    ])
    const type = ret[name]
    const isPreRelease = type.startsWith('pre')
    let expectVersion = semver.inc(currentVersion, type, `alpha.${Date.now()}`) as string
    expectVersion = isPreRelease ? expectVersion.slice(0, -2) : expectVersion
    name = 'version confirm'
    const confirm = await inquirer.prompt([
      { name, type: 'confirm', message: `All packages version ${currentVersion} -> ${expectVersion}:` },
    ])
    if (!confirm[name]) return
    updateVersion(expectVersion)

    if (!isPreRelease) {
      await changelog()
      await pushGit(expectVersion, cmd.remote)
    }

    await publish(isPreRelease)

    logger.success(`Release version ${expectVersion} successfuly!`)

    if (isPreRelease) {
      try {
        await execa('git', ['restore', '**/package.json'])
        await execa('git', ['restore', 'package.json'])
      } catch (e) {
        logger.error(`Restore package.json has failed, please restoree manually`)
      }
    }
  } catch (e: any) {
    logger.error(e.toString())
    process.exit(1)
  }
}
