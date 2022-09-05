import { transformAsync } from "@babel/core";
import { writeFileSync, readFileSync, removeSync, writeFile } from "fs-extra";
import { camelCase, upperFirst } from "lodash";
import { isDir, replaceExt } from "../shared/fs-utils";
import { extractStyleDependencies } from "./compileStyle";
import { resolve } from "path";
import logger from "../shared/logger";
import { UI_PACKAGE_JSON } from "../shared/constant";
import { getSmyConfig } from "../config/getConfig";

export const IMPORT_VUE_PATH_RE =
  /((?<!['"`])import\s+.+from\s+['"]\s*\.{1,2}\/.+)\.vue(\s*['"`]);?(?!\s*['"`])/g;
export const IMPORT_TS_PATH_RE =
  /((?<!['"`])import\s+.+from\s+['"]\s*\.{1,2}\/.+)\.ts(\s*['"`]);?(?!\s*['"`])/g;
export const REQUIRE_TS_PATH_RE =
  /(?<!['"`]\s*)(require\s*\(\s*['"]\s*\.{1,2}\/.+)\.ts(\s*['"`]\))(?!\s*['"`])/g;

const scriptReplacer = (_: any, p1: string, p2: string) => `${p1}.js${p2}`;

export const replaceVueExt = (script: string) => script.replace(IMPORT_VUE_PATH_RE, scriptReplacer);

export const replaceTSExt = (script: string): string =>
  script.replace(IMPORT_TS_PATH_RE, scriptReplacer).replace(REQUIRE_TS_PATH_RE, scriptReplacer);

export function moduleCompatible(script: string): string {
  const moduleCompatible = getSmyConfig()?.moduleCompatible ?? {};
  Object.keys(moduleCompatible).forEach((esm) => {
    const commonjs = moduleCompatible[esm];
    script = script.replace(esm, commonjs);
  });
  return script;
}

export async function compileScript(script: string, file: string) {
  const moduleType = process.env.BABEL_MODULE;
  const isCjs = moduleType === "commonjs";

  if (isCjs) {
  }

  const result = await transformAsync(script, { filename: file });
  let code = result?.code;
  if (!code) return logger.error(`${file} code is empty`);

  code = extractStyleDependencies(file, code, { expect: "css", self: true });
  code = extractStyleDependencies(file, code, { expect: "less", self: true });

  code = replaceVueExt(code);
  code = replaceTSExt(code);

  removeSync(file);
  writeFileSync(replaceExt(file, ".js"), code, "utf-8");
}

export async function compileScriptFile(file: string) {
  const sources = readFileSync(file, "utf-8");

  await compileScript(sources, file);
}

export async function compileESEntry(dir: string, publicDirs: string[]) {
  const imports: string[] = [];
  const plugins: string[] = [];
  const internalComponents: string[] = [];
  const publicComponents: string[] = [];
  const cssImports: string[] = [];
  const lessImports: string[] = [];
  const version = require(UI_PACKAGE_JSON).version;
  const { namespace = "smy" } = getSmyConfig();
  // const componentPrefix = upperFirst(namespace);

  publicDirs.forEach((dirname: string) => {
    const publicComponent = upperFirst(camelCase(dirname));
    publicComponents.push(publicComponent);
    imports.push(`import ${publicComponent}, * as ${publicComponents}Module from './${dirname}'`);
    internalComponents.push(
      `export const _${publicComponent}Component = ${publicComponent}Module._${publicComponent}Component || {}`
    );
    plugins.push(`useComponent(app, ${publicComponent})`);
    const styleDir = resolve(dir, `./${dirname}/style`);
    if (isDir(styleDir)) {
      cssImports.push(`import './${dirname}/style'`);
      lessImports.push(`import './${dirname}/style/less'`);
    }
  });

  const install = `
const installTargets = [];
function install(app) {
  if (installTargets.includes(app)) return;
  installTargets.push(app);
  ${plugins.join("\n ")}
}

function useComponent (app, component) {
  component.install = function (app) {
    const { name, alias } = component;
    registerComponent(app, name, component);
    if (alias) {
      alias.forEach((alia) => {
        registerComponent(app, alia, component);
      })
    }
  };
  app.use(component)
}

function registerComponent(app, name, component) {
  const registered = app.component(name);
  if (!registered) {
    app.component(name, component);
  }
}
`;

  const indexTemplate = `\
${imports.join("\n")}\n
${internalComponents.join("\n")}\n
const version = '${version}';
${install}
export {
  install,
  version,
  ${publicComponents.join(",\n ")}
}

export default {
  install,
  version,
  ${publicComponents.join(",\n  ")}
}
`;

  const styleTemplate = `\
${cssImports.join("\n")}
`;

  const lessTemplate = `\
${lessImports.join("\n")}
`;
  await Promise.all([
    writeFile(resolve(dir, "index.js"), indexTemplate, "utf-8"),
    writeFile(resolve(dir, "style.js"), styleTemplate, "utf-8"),
    writeFile(resolve(dir, "less.js"), lessTemplate, "utf-8"),
  ]);
}
