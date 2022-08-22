import { resolve } from "path";

export const CWD = process.cwd();
export const SMY_CONFIG = resolve(CWD, "smy.config.js");
export const SRC_DIR = resolve(CWD, "src");
export const ES_DIR = resolve(CWD, "es");
export const LIB_DIR = resolve(CWD, "lib");
export const TYPES_DIR = resolve(CWD, "types");

export const VITE_RESOLVE_EXTENSION = [".vue", ".ts", ".js", ".mjs", ".tsx", ".jsx"];
export const PUBLIC_DIR_INDEXES = ["index.vue", "index.tsx", "index.ts", "index.jsx", "index.js"];
export const SCRIPTS_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js"];
export const STYLE_DIR_NAME = "style";
export const EXAMPLE_DIR_NAME = "example";
export const UI_PACKAGE_JSON = resolve(CWD, 'package.json')
export const CLI_PACKAGE_JSON = resolve(__dirname, '../../package.json')

// site
export const SITE = resolve(__dirname, "../../site");
export const SITE_OUTPUT_PATH = resolve(CWD, 'site')
export const SITE_OUTPUT_DIR = resolve(CWD, "site");
export const SITE_DIR = resolve(CWD, ".smy/site");
export const SITE_PC_DIR = resolve(CWD, ".smy/site/pc");
export const SITE_PC_ROUTES = resolve(CWD, ".smy/pc.routes.ts");
export const SITE_PUBLIC_PATH = resolve(CWD, "site");
export const SITE_CONFIG = resolve(CWD, ".smy/site.config.json");
