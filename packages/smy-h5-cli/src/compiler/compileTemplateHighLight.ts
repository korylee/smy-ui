import { ensureDir, writeFile, readdirSync, readFileSync } from 'fs-extra'
import { get } from 'lodash'
import { resolve } from 'path'
import { getSmyConfig } from '../config/getConfig'
import {
  CLI_PACKAGE_JSON,
  HL_ATTRIBUTES_JSON,
  HL_COMPONENT_NAME_RE,
  HL_DIR,
  HL_TAGS_JSON,
  SRC_DIR,
} from '../shared/constant'
import { isDir, isMD } from '../shared/fs-utils'

export async function compileTemplateHighlight() {
  await ensureDir(HL_DIR)

  const smyConfig = getSmyConfig()
  const tags: Record<string, any> = {}
  const attributes: Record<string, any> = {}
  const webTypes: Record<string, any> = {
    $schema: 'https://raw.githubusercontent.com/JetBrains/web-types/master/schema/web-types.json',
    framework: 'vue',
    version: require(CLI_PACKAGE_JSON).version,
    name: smyConfig?.title,
    contributions: {
      html: {
        tags: [],
        'types-syntax': 'typescript',
      },
    },
  }

  compileDir(SRC_DIR, tags, attributes, webTypes, smyConfig)

  await Promise.all([
    writeFile(HL_TAGS_JSON, JSON.stringify(tags, null, 2)),
    writeFile(HL_ATTRIBUTES_JSON, JSON.stringify(attributes, null, 2)),
  ])
}

function compileDir(
  path: string,
  tags: Record<string, any>,
  attributes: Record<string, any>,
  webTypes: Record<string, any>,
  smyConfig: Record<string, any>
) {
  const dir = readdirSync(path)
  dir.forEach((filename) => {
    const filePath = resolve(path, filename)
    isDir(filePath) && compileDir(filePath, tags, attributes, webTypes, smyConfig)
    isMD(filePath) && compileMD(filePath, tags, attributes, webTypes, smyConfig)
  })
}

function compileMD(
  path: string,
  tags: Record<string, any>,
  attributes: Record<string, any>,
  webTypes: Record<string, any>,
  smyConfig: Record<string, any>
) {
  if (!path.endsWith('index.md')) return
  const md = readFileSync(path, 'utf-8')
  const componentName = path.match(HL_COMPONENT_NAME_RE)![2]
  const table = {}
  compileTags(table, tags, componentName, smyConfig)
}

function compileTags(
  table: Record<string, any>,
  tags: Record<string, any>,
  componentName: string,
  smyConfig: Record<string, any>
) {
  tags[`${get(smyConfig, 'namespace')}-${componentName}`] = {
    attributes: [],
  }
}
