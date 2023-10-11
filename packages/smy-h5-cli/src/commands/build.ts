import { ensureDirSync } from 'fs-extra'
import { compileSiteEntry } from '../compiler/compileSiteEntry'
import { getBuildConfig } from '../config/vite.config'
import { SRC_DIR } from '../shared/constant'
import { build as buildVite } from 'vite'
import { getSmyConfig } from '../config/smyConfig'

export async function build() {
  process.env.ENV = 'production'

  ensureDirSync(SRC_DIR)
  await compileSiteEntry()
  const smyConfig = getSmyConfig()
  const buildConfig = getBuildConfig(smyConfig)

  await buildVite(buildConfig)
}
