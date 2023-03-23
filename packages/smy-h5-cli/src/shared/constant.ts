import { resolve } from 'path'

export const CWD = process.cwd()
export const SMY_CONFIG = resolve(CWD, 'smy.config.js')
export const SRC_DIR = resolve(CWD, 'src')
export const ES_DIR = resolve(CWD, 'es')
export const UMD_DIR = resolve(CWD, 'umd')
export const LIB_DIR = resolve(CWD, 'lib')
export const TYPES_DIR = resolve(CWD, 'types')
export const ROOT_PAGES_DIR = resolve(CWD, 'pages')
export const ROOT_DOCS_DIR = resolve(CWD, 'docs')
export const TS_CONFIG = resolve(CWD, 'tsconfig.json')
export const TS_TYPES_CONFIG = resolve(CWD, 'tsconfig.types.json')

export const ESLINT_EXTENSIONS = ['.vue', '.ts', '.js', '.mjs', '.tsx', '.jsx']
export const VITE_RESOLVE_EXTENSION = ['.vue', '.ts', '.js', '.mjs', '.tsx', '.jsx']
export const PUBLIC_DIR_INDEXES = ['index.vue', 'index.tsx', 'index.ts', 'index.jsx', 'index.js']
export const SCRIPTS_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js']
export const STYLE_DIR_NAME = 'style'
export const EXAMPLE_DIR_NAME = 'example'
export const DIR_INDEX = 'index.vue'
export const DOCS_DIR_NAME = 'docs'
export const TESTS_DIR_NAME = '__tests__'
export const UI_PACKAGE_JSON = resolve(CWD, 'package.json')
export const CLI_PACKAGE_JSON = resolve(__dirname, '../../package.json')

// site
export const SITE = resolve(__dirname, '../../site')
export const SITE_OUTPUT_PATH = resolve(CWD, 'site')
export const SITE_DIR = resolve(CWD, '.smy/site')
export const SITE_PC_DIR = resolve(CWD, '.smy/site/pc')
export const SITE_PC_ROUTES = resolve(CWD, '.smy/pc.routes.ts')
export const SITE_MOBILE_ROUTES = resolve(CWD, '.smy/mobile.routes.ts')
export const SITE_PUBLIC_PATH = resolve(CWD, 'public')
export const SITE_CONFIG = resolve(CWD, '.smy/site.config.json')

// template highlight
export const HL_COMPONENT_NAME_RE = /.*(\/|\\)(.+)(\/|\\)docs(\/|\\)/
export const HL_API_RE = /##\s*API\n+/
export const HL_TITLE_ATTRIBUTES_RE = /###\s*属性|Props|Attrs\s*\n+/
export const HL_TITLE_EVENTS_RE = /###\s*事件|Events\s*\n+/
export const HL_TITLE_SLOTS_RE = /###\s*插槽|Slots\s*\n+/
export const HL_DIR = resolve(CWD, 'highlight')
export const HL_TAGS_JSON = resolve(HL_DIR, 'tags.json')
export const HL_ATTRIBUTES_JSON = resolve(HL_DIR, 'attributes.json')

// jest
export const JEST_CONFIG = resolve(__dirname, '../config/jest.config.js')
export const JEST_MEDIA_MOCK = resolve(__dirname, '../config/jest.media.mock.js')
export const JEST_STYLE_MOCK = resolve(__dirname, '../config/jest.style.mock.js')

// icons
export const ICONS_DIST_DIR = resolve(CWD, 'dist')
export const ICONS_STYLE_DIR = resolve(ICONS_DIST_DIR, 'style')
export const ICONS_PNG_DIR = resolve(ICONS_DIST_DIR, 'png')
export const ICONS_FONT_DIR = resolve(ICONS_DIST_DIR, 'font')
export const ICONS_COMPONENTS_DIR = resolve(ICONS_DIST_DIR, 'vue')
export const ICONS_SVG_DIR_NAME = 'svg'
export const ICONS_SVG_DIR = resolve(CWD, ICONS_SVG_DIR_NAME)
// 自定义uincode从e601开始
export const START_UNICODE_NUM = 0xe601
export const MAX_UNICODE_NUM = 1048576
