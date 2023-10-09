import { CWD, JEST_CONFIG } from '../shared/constant'
import { runCLI } from 'jest'
import logger from '../shared/logger'
import { compileUiEntry } from '../compiler/compileSiteEntry'

interface JestCommandOptions {
  watch?: boolean
  watchAll?: boolean
  clearCache?: boolean
}

/**
 * @param dirs 单测的文件夹 空为所有
 * @param cmd
 */
export async function jest(dirs?: string[], { watch, watchAll, clearCache }: JestCommandOptions = {}) {
  process.env.NODE_ENV = 'test'
  const testRegex = dirs?.length ? dirs.map((component) => `${component}/__tests__/.*.test.[jt]s?$`) : undefined

  const config = {
    rootDir: CWD,
    watch: watch,
    watchAll: watchAll,
    config: JEST_CONFIG,
    clearCache: clearCache,
    testRegex,
  }
  try {
    await compileUiEntry()
    const response = await runCLI(config as any, [CWD])
    if (!response.results.success && !watch) {
      process.exit(1)
    }
  } catch (e: any) {
    logger.error(e.toString())
    process.exit(1)
  }
}
