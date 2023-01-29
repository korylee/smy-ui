import logger from '../shared/logger'
import { updateVersion } from './update-version'
import { publish } from './publish'

export async function release(cmd: { remote?: string }) {
  try {
    await updateVersion()

    await publish(cmd)
  } catch (e: any) {
    logger.error(e.toString())
    process.exit(1)
  }
}
