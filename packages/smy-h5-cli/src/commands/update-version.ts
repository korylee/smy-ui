import inquirer from 'inquirer'
import semver from 'semver'
import { CWD, UI_PACKAGE_JSON } from '../shared/constant'
import glob from 'glob'
import { resolve } from 'path'
import { writeFileSync } from 'fs-extra'
import logger from '../shared/logger'
import execa from 'execa'

// 不懂看这 https://www.jianshu.com/p/5565536a1f82
const releaseTypes = ['premajor', 'major', 'prepatch', 'patch', 'preminor', 'minor']

async function isWorktreeEmpty() {
  const ret = await execa('git', ['status', '--porcelain'])
  return !ret.stdout
}

export async function updateVersion() {
  try {
    const currentVersion = require(UI_PACKAGE_JSON).version
    if (!currentVersion) {
      throw Error('Your Package is missing the verison field')
    }
    if (!(await isWorktreeEmpty())) {
      throw Error('Git worktree is not empty, please commit changed')
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
    if (!confirm[name]) throw new Error('cancel')
    const packageJsons = glob.sync('packages/*/package.json')
    packageJsons.push('package.json')

    packageJsons.forEach((path: string) => {
      const file = resolve(CWD, path)
      const config = require(file)

      config.version = expectVersion
      writeFileSync(file, JSON.stringify(config, null, 2))
    })
  } catch (e: any) {
    logger.error(e.toString())
    process.exit(1)
  }
}
