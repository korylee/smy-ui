import { ensureDir, writeFile, readdirSync, readFileSync } from 'fs-extra'
import { get } from 'lodash'
import { resolve } from 'path'
import { getSmyConfig } from '../config/getConfig'
import {
  CLI_PACKAGE_JSON,
  HL_API_RE,
  HL_ATTRIBUTES_JSON,
  HL_COMPONENT_NAME_RE,
  HL_DIR,
  HL_TAGS_JSON,
  HL_TITLE_ATTRIBUTES_RE,
  SRC_DIR,
} from '../shared/constant'
import { isDir, isMD } from '../shared/fs-utils'

const TABLE_HEAD_RE = /\s*\|.*\|\s*\n\s*\|.*---+\s*\|\s*\n+/
const TABLE_FOOT_RE = /(\|\s*$)|(\|\s*\n(?!\s*\|))/
const SMY_AXIS = '__smy_axis__'

export const replaceDot = (s: string) => s.replace(/`/g, '')
export const replaceUnderline = (s: string) => s.replace(/_/g, '')

function parseTable(table: string) {
  if (!table) return []
  const rows = table.split('\n').filter(Boolean)
  return rows.map((row) => {
    const cols = row.split('|')
    cols.shift()
    cols.pop()
    return cols.map((col) => col.replace(new RegExp(SMY_AXIS, 'g'), '|').trim())
  })
}

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
  const attributesTable = parseTable(compileTable(md, HL_TITLE_ATTRIBUTES_RE))

  const table = {
    attributesTable,
  }
  compileTags(table, tags, componentName, smyConfig)
  compileAttributes(table, attributes, componentName, smyConfig)
}

function compileTable(md: string, titleRe: RegExp): string {
  const apiMatched = md.match(HL_API_RE)
  if (!apiMatched) return ''
  md = md.slice((apiMatched.index as number) + apiMatched[0].length)
  const titleMatched = md.match(titleRe)
  if (!titleMatched) return ''
  md = md.slice((titleMatched.index as number) + titleMatched[0].length)
  const tableHeadMatched = md.match(TABLE_HEAD_RE)
  if (!tableHeadMatched) return ''
  md = md.slice((tableHeadMatched.index as number) + tableHeadMatched[0].length)
  const tableFootMatched = md.match(TABLE_FOOT_RE)
  if (!tableFootMatched) return ''
  md = md.slice(0, (tableFootMatched.index as number) + tableFootMatched[0].length)
  return md.replace(/\\\|/g, SMY_AXIS).trim()
}

function compileTags(
  table: Record<string, any>,
  tags: Record<string, any>,
  componentName: string,
  smyConfig: Record<string, any>
) {
  tags[`${get(smyConfig, 'namespace')}-${componentName}`] = {
    attributes: table.attributesTable.map((row: any) => replaceDot(row[0])),
  }
}

function compileAttributes(
  table: Record<string, any>,
  attributes: Record<string, any>,
  componentName: string,
  smyConfig: Record<string, any>
) {
  table.attributesTable.forEach((row: any) => {
    const attrNamespace = `${get(smyConfig, 'namespace')}-${componentName}/${replaceDot(row[0])}`
    attributes[attrNamespace] = {
      type: replaceUnderline(row[2]),
      description: `${row[1]} 默认值：${replaceDot(row[3])}`,
    }
  })
}
