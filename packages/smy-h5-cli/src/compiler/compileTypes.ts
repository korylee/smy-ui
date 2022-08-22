import { ensureDir, readdir, writeFile } from "fs-extra";
import { getSmyConfig } from "../config/getConfig";
import { TYPES_DIR, UI_PACKAGE_JSON } from "../shared/constant";
import { resolve } from "path";
import { upperFirst } from "lodash";

export async function compileTypes() {
  const config = getSmyConfig();
  const namespace = config.namespace;
  const { name } = require(UI_PACKAGE_JSON);
  await ensureDir(TYPES_DIR);
  const entryDir = await readdir(TYPES_DIR);
  const exports: string[] = [];
  const declares: string[] = [];

  entryDir.forEach((filename) => {
    if (["index.d.ts", "global.d.ts"].includes(filename)) return;
    const componentName = filename.slice(0, filename.indexOf(".d.ts"));

    exports.push(`export * from './${componentName}'`);
    if (!componentName.startsWith(namespace)) {
      const upperComponentName = upperFirst(componentName);
      declares.push(
        `${upperFirst(
          namespace
        )}${upperComponentName}: typeof import('${name}')['_${upperComponentName}Component']`
      );
    }
  });
  const template = `\
import type { VueConstructor } from 'vue'

export const install: (app: VueConstructor) => void

export const version: string

export const componentPrefix: string

${exports.join("\n")}
`;
  await Promise.all([writeFile(resolve(TYPES_DIR, "index.d.ts"), template)]);
}
