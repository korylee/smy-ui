import { ensureDirSync, pathExistsSync } from "fs-extra";
import { merge } from "lodash";
import { createServer, FSWatcher, ViteDevServer } from "vite";
import { compileSiteEntry } from "../compiler/compileSiteEntry";
import { getDevConfig, getSmyConfig } from "../config/getConfig";
import { SMY_CONFIG, SRC_DIR } from "../shared/constant";
import logger from "../shared/logger";

let server: ViteDevServer | undefined;
let watcher: FSWatcher | undefined;

async function startServer(force: boolean = false) {
  const isRestart = Boolean(server);
  logger.info(`${isRestart ? "Res" : "S"}tarting server...`);

  await server?.close();
  await watcher?.close();

  // build all config
  await compileSiteEntry()
  const config = getSmyConfig();
  const devConfig = getDevConfig(config);
  const inlineConfig = merge(devConfig, force ? { server: { force: true } } : {});

  // create all instance
  server = await createServer(inlineConfig)
  await server.listen()
  server.printUrls()

  if(pathExistsSync(SMY_CONFIG)) {}

  logger.success(`\n${isRestart?'Res':'S'}tart successfully!!!`)
}

export async function dev(cmd: { force?: boolean }) {
  process.env.NODE_ENV = "development";
  ensureDirSync(SRC_DIR);
  await startServer(cmd.force);
}
