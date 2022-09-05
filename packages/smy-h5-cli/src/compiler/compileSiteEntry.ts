import { copy, ensureDir, ensureFile, link, readdir, remove } from 'fs-extra'
import { getSmyConfig } from '../config/getConfig'
import {
  EXAMPLE_DIR_NAME,
  SITE,
  SITE_DIR,
  SRC_DIR,
  DIR_INDEX,
  SITE_PC_DIR,
  DOCS_DIR_NAME,
  ROOT_PAGES_DIR,
  SITE_PC_ROUTES,
  SITE_MOBILE_ROUTES,
} from '../shared/constant'
import { glob, isDir, outputFileSyncOnChange } from '../shared/fs-utils'
import slash from 'slash'
import { resolve } from 'path'

const EXAMPLE_COMPONENT_NAME_RE = /\/([-\w]+)\/example\/index.vue/
const ROOT_PAGE_RE = /\/pages\/([-\w]+)\/index\.([-\w]+)$/

export function getRootRoutePath(rootPath: string): string {
  const [, routePath] = rootPath.match(ROOT_PAGE_RE) ?? []

  return `/${routePath}`
}

const getExampleRoutePath = (examplePath: string) => '/' + examplePath.match(EXAMPLE_COMPONENT_NAME_RE)?.[1]

const findExamples = () => glob(`${SRC_DIR}/**/${EXAMPLE_DIR_NAME}/${DIR_INDEX}`)

const findComponentDocs = () => glob(`${SRC_DIR}/**/${DOCS_DIR_NAME}/*.md`)

async function findRoot(): Promise<string[]> {
  const userPages = await glob(`${ROOT_PAGES_DIR}/**`)
  const basePages = await glob(`${SITE}/pc/pages/**/index.+(vue|ts|tsx|js|jsx)`)

  // filter
  const filterMap = new Map()
  basePages.forEach((page) => {
    const [, routePath, ext] = page.match(ROOT_PAGE_RE) ?? []
    filterMap.set(routePath, slash(`${SITE_PC_DIR}/pages/${routePath}/index.${ext}`))
  })
  return Array.from(filterMap.values())
}

async function compileMobileSiteRoutes() {
  const examples: string[] = await findExamples()
  const routes = examples.map(
    (example) => `
  {
    path: '${getExampleRoutePath(example)}',
    // @ts-ignore
    component: () => import('${example}')
  }
  `
  )
  const source = `export default [
    ${routes.join(', ')}
  ]`
  await outputFileSyncOnChange(SITE_MOBILE_ROUTES, source)
}

async function compilePcSiteRoutes() {
  const [root] = await Promise.all([findRoot()])

  const rootPagesRoutes = root.map(
    (rootPath) => `
  {
    path: '${getRootRoutePath(rootPath)}',
    // @ts-ignore
    component: () => import('${rootPath}')
  }`
  )

  const layoutRoutes = `
  {
    path: '/layout',
    // @ts-ignore
    component: ()=> import('${slash(SITE_PC_DIR)}/Layout.vue'),
    children: []
  }`

  const source = `export default [\
    ${rootPagesRoutes.join(',')},
    ${layoutRoutes}
  ]`
  outputFileSyncOnChange(SITE_PC_ROUTES, source)
}

async function linkDir(path: string, newPath: string): Promise<void> {
  const dirs = await readdir(path)
  await ensureDir(newPath)
  await Promise.all(
    dirs.map((dir) => {
      const dirPath = resolve(path, dir)
      const newDirPath = resolve(newPath, dir)
      if (isDir(dirPath)) {
        return linkDir(dirPath, newDirPath)
      }
      return link(dirPath, newDirPath)
    })
  )
}

export async function compileSiteSource(siteLink: boolean) {
  await remove(SITE_DIR)
  if (siteLink) {
    return linkDir(SITE, SITE_DIR)
  }
  return copy(SITE, SITE_DIR)
}

export async function compileSiteEntry(siteLink = false) {
  getSmyConfig(true)
  await Promise.all([compilePcSiteRoutes(), compileMobileSiteRoutes(), compileSiteSource(siteLink)])
}
