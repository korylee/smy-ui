#!/usr/bin/env node
import { Command } from 'commander'
import { dev } from './commands/dev'
import { CLI_PACKAGE_JSON } from './shared/constant'
import logger from './shared/logger'
import { lintCommit } from './commands/lintCommit'

const program = new Command()

program.version(`smy-cli ${require(CLI_PACKAGE_JSON).version}`).usage('<command> [options]')
program
  .command('dev')
  .option('-f --force', 'Force dep pre-optimization regardless of whether deps have changed')
  .option('-sl --siteLink', 'Hard link site the folder')
  .description('Run development enviroment')
  .action(dev)

program.command('lint-commit <gitParams>').description('Lint commit message').action(lintCommit)

/**
program
  .command('compile')
  .description('Compile Smy components library code')
  .option('-nu, --noUmd', 'Do not compile umd target code')
  .action(compile)

program.command('build').description('Build site for production').action(build)

program.command('preview').description('Preview site or production').action(preview)

program.command('lint').description('Lint code').action(lint)

program
  .command('changelog')
  .option('-rc --releaseCount <releaseCount>', 'Release count')
  .option('-f --file <file>', 'Changelog filename')
  .description('Generate changelog')
  .action(changelog)

program
  .command('release')
  .option('-r --remote <remote>', 'Remote name')
  .description('Release all packages and generate changelogs')
  .action(release)

program
  .command('publish')
  .option('-r --remote <remote>', 'Remote name')
  .description('publish all packages and generate changelogs')
  .action(publish)

program.command('update-version').description('Update all packages version').action(updateVersion)


program
  .command('jest')
  .description('Run Jest in work directory')
  .option('-w, --watch', 'Watch files for changes and rerun tests related to changed files')
  .option('-wa, --watchAll', 'Watch files for changes and rerun all tests when something changes')
  .option('-c, --component <componentName>', 'Test a specific component')
  .option('-cc --clearCache', 'Clear test cache')
  .action(jest)

program.command('build:icons').description('Build icons').action(icons)
 */
program.on('command:*', ([cwd]) => {
  program.outputHelp()
  logger.error(`\nUnknown command ${cwd}.\n`)
  process.exitCode = 1
})

program.parse()
