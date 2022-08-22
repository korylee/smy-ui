import {
  appendFileSync,
  ensureFileSync,
  lstatSync,
  pathExistsSync,
  readdir,
  readFileSync,
} from "fs-extra";
import { extname, resolve } from "path";
import { PUBLIC_DIR_INDEXES, SCRIPTS_EXTENSIONS, SRC_DIR } from "./constant";

export async function getPublicDirs(): Promise<string[]> {
  const srcDir: string[] = await readdir(SRC_DIR);
  return srcDir.filter((filename: string) => isPublicDir(resolve(SRC_DIR, filename)));
}

export const isDir = (file: string): boolean =>
  pathExistsSync(file) && lstatSync(file).isDirectory();

export const isSFC = (file: string): boolean => pathExistsSync(file) && extname(file) === ".vue";

export const isDTS = (file: string): boolean => pathExistsSync(file) && file.endsWith(".d.ts");

export const isLess = (file: string): boolean => pathExistsSync(file) && extname(file) === ".less";

export const isScript = (file: string): boolean =>
  pathExistsSync(file) && SCRIPTS_EXTENSIONS.includes(extname(file));

export const replaceExt = (file: string, ext: string): string => file.replace(extname(file), ext);

export const isPublicDir = (dir: string): boolean =>
  PUBLIC_DIR_INDEXES.some((index) => pathExistsSync(resolve(dir, index)));

export function smartAppendFileSync(file: string, code: string, force = true) {
  if (!pathExistsSync(file)) {
    if (!force) return;
    ensureFileSync(file);
  }
  const content = readFileSync(file, "utf-8");
  if (!content.includes(code)) {
    appendFileSync(file, code);
  }
}
