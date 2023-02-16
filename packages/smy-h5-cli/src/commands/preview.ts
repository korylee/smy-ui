import { pathExistsSync } from 'fs-extra'
import { SITE_OUTPUT_PATH } from '../shared/constant'
import logger from '../shared/logger'
import { start } from 'live-server'

export async function preview() {
  if (!pathExistsSync(SITE_OUTPUT_PATH)) {
    logger.warning('Cannot find the site folder, yout must first run theme build command to build theme document site')
    return
  }
  try {
    start({ port: 5500, root: SITE_OUTPUT_PATH })
    // await command('live-server --port=5500', { cwd: SITE_OUTPUT_PATH }).stdout?.pipe(process.stdout)
  } catch (e: any) {
    logger.error(e.toString())
  }
}
