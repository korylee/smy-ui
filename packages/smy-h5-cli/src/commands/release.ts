import logger from '../shared/logger'
import { updateVersion } from './update-version'
import { publish } from './publish'

export async function release(packages?: string[], cmd: { remote?: string } = {}) {
  try {
    await updateVersion()

    await publish(packages, cmd)
  } catch (e: any) {
    logger.error(e.toString())
    process.exit(1)
  }
}
