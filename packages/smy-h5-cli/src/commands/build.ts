import { ensureDirSync } from "fs-extra";
import { compileSiteEntry } from "../compiler/compileSiteEntry";
import { getBuildConfig, getSmyConfig } from "../config/getConfig";
import { SRC_DIR } from "../shared/constant";
import { build as buildVite } from "vite";

export async function build() {
  process.env.ENV = "production";

  ensureDirSync(SRC_DIR);
  await compileSiteEntry();
  const smyConfig = getSmyConfig();
  const buildConfig = getBuildConfig(smyConfig);

  await buildVite(buildConfig);
}
