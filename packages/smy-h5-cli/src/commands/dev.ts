import { ensureDirSync, pathExistsSync } from 'fs-extra'
import { createServer, ViteDevServer } from 'vite'
import { compileSiteEntry } from '../compiler/compileSiteEntry'
import { getDevConfig } from '../config/viteConfig'
import { SMY_CONFIG, SRC_DIR } from '../shared/constant'
import logger from '../shared/logger'
import chokidar, { FSWatcher } from 'chokidar'
import { getSmyConfig } from '../config/smyConfig'

let server: ViteDevServer | undefined
let watcher: FSWatcher | undefined

async function startServer(cmd: DevOptions) {
  const { force, siteLink } = cmd
  const isRestart = Boolean(server)

  logger.info(`${isRestart ? 'Res' : 'S'}tarting server...`)

  await server?.close()
  await watcher?.close()

  // build all config
  await compileSiteEntry(siteLink)
  const config = getSmyConfig()
  const devConfig = getDevConfig(config)
  if (force) {
    ;(devConfig.optimizeDeps ?? (devConfig.optimizeDeps = {})).force = true
  }

  // create all instance
  server = await createServer(devConfig)
  await server.listen()
  server.printUrls()

  if (pathExistsSync(SMY_CONFIG)) {
    watcher = chokidar.watch(SMY_CONFIG)
    watcher.on('change', () => startServer(cmd))
  }

  logger.success(`\n${isRestart ? 'Res' : 'S'}tart successfully!!!`)
}

export async function dev(cmd: DevOptions) {
  process.env.NODE_ENV = 'development'
  ensureDirSync(SRC_DIR)
  await startServer(cmd)
}

interface DevOptions {
  force?: boolean
  siteLink?: boolean
}
