import { copy } from "fs-extra";
import { getSmyConfig } from "../config/getConfig";
import { SITE, SITE_DIR } from "../shared/constant";

async function compilePcSiteRoutes() {}

export async function compileSiteSource() {
  return copy(SITE, SITE_DIR);
}

export async function compileSiteEntry() {
  getSmyConfig();
  await Promise.all([compilePcSiteRoutes(), compileSiteSource()]);
}
