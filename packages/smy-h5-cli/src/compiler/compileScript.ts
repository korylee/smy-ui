import { dirname, extname, resolve } from 'node:path'
import { transformAsync } from '@babel/core'
import esbuild from 'esbuild'
import {
  writeFileSync,
  readFileSync,
  removeSync,
  writeFile,
  existsSync,
  unlink,
  pathExistsSync,
  readdirSync,
  readJsonSync,
} from 'fs-extra'
import { camelCase, upperFirst } from 'lodash'
import { isDir, replaceExt } from '../shared/fs-utils'
import { IMPORT_CSS_RE, IMPORT_LESS_RE, extractStyleDependencies } from './compileStyle'
import logger from '../shared/logger'
import {
  BUNDLE_ENRTY_FILENAME,
  CWD,
  SCRIPT_EXT_NAMES,
  SCRIPT_INDEXES,
  STYLE_EXT_NAMES,
  STYLE_INDEXES,
  UI_PACKAGE_JSON,
} from '../shared/constant'
import execa from 'execa'

// https://regexr.com/765a4
export const IMPORT_FROM_DEPENDENCE_RE = /import\s+?[\w\s{},$*]+\s+from\s+?(".*?"|'.*?')/g
// https://regexr.com/767e6
export const EXPORT_FROM_DEPENDENCE_RE = /export\s+?[\w\s{},$*]+\s+from\s+?(".*?"|'.*?')/g
// https://regexr.com/764ve
export const IMPORT_DEPENDENCE_RE = /import\s+(".*?"|'.*?')/g

function tryMatchExtname(file: string, extname: string[]) {
  for (const ext of extname) {
    const matched = `${file}${ext}`
    if (pathExistsSync(matched)) {
      return ext
    }
  }
}

export function resolveDependence(file: string, script: string) {
  const replacer = (source: string, dependence: string) => {
    dependence = dependence.slice(1, dependence.length - 1)
    const ext = extname(dependence)
    const targetDependenceFile = resolve(dirname(file), dependence)
    const scriptExt = '.js'
    const inNodeModules = !dependence.startsWith('.')
    const done = (targetDependence: string) => source.replace(dependence, targetDependence)

    if (inNodeModules) {
      return source
    }
    if (ext) {
      if (SCRIPT_EXT_NAMES.includes(ext)) {
        return done(dependence.replace(ext, scriptExt))
      }
      if (STYLE_EXT_NAMES.includes(ext)) {
        return source
      }
    } else {
      const matchScript = tryMatchExtname(targetDependenceFile, SCRIPT_EXT_NAMES)
      if (matchScript) {
        return done(`${dependence}${scriptExt}`)
      }

      if (isDir(targetDependenceFile)) {
        const files = readdirSync(targetDependenceFile)
        const hasScriptIndex = files.some((file) => SCRIPT_INDEXES.includes(extname(file)))
        if (hasScriptIndex) {
          return done(`${dependence}/index/${scriptExt}`)
        }
        const hasStyleIndex = files.some((file) => STYLE_INDEXES.includes(extname(file)))
        if (hasStyleIndex) {
          return done(`${dependence}/index.css`)
        }
      }
    }
    return ''
  }
  return script
    .replace(IMPORT_FROM_DEPENDENCE_RE, replacer)
    .replace(EXPORT_FROM_DEPENDENCE_RE, replacer)
    .replace(IMPORT_DEPENDENCE_RE, replacer)
}

export async function compileScript(script: string, file: string) {
  // ts|tsx|jsx -> js
  const result = await transformAsync(script, {
    filename: file,
  })
  let code = script
  if (result?.code) {
    code = result.code
  }
  const esbuildResult = await esbuild.transform(code, {
    loader: 'ts',
    target: 'es2016',
    format: 'esm',
  })
  code = esbuildResult.code
  if (!code) return logger.error(`${file} code is empty`)
  code = resolveDependence(file, code)
  code = extractStyleDependencies(file, code, IMPORT_CSS_RE)
  code = extractStyleDependencies(file, code, IMPORT_LESS_RE)

  removeSync(file)
  writeFileSync(replaceExt(file, '.js'), code, 'utf-8')
}

export async function compileScriptFile(file: string) {
  const sources = readFileSync(file, 'utf-8')

  await compileScript(sources, file)
}

export async function compileESEntry(dir: string, publicDirs: string[]) {
  const imports: string[] = []
  const plugins: string[] = []
  const exports: string[] = []
  const publicComponents: string[] = []
  const cssImports: string[] = []

  publicDirs.forEach((dirname: string) => {
    if (dirname.startsWith('_')) return
    const publicComponent = upperFirst(camelCase(dirname))
    const module = `'./${dirname}/index.js'`
    publicComponents.push(publicComponent)
    imports.push(`import ${publicComponent} from ${module}`)
    exports.push(`export * from ${module}`)
    plugins.push(`${publicComponent}.install && app.use(${publicComponent})`)
    if (!existsSync(resolve(dir, `./${dirname}/style`))) return
    cssImports.push(`import './${dirname}/style/index.js'`)
  })

  const install = `
function install(app) {
  ${plugins.join('\n  ')}
}
`
  const version = `const version = '${readJsonSync(UI_PACKAGE_JSON).version}'`

  const indexTemplate = `\
${imports.join('\n')}\n
${exports.join('\n')}\n
${version}
${install}
export {
  install,
  version,
  ${publicComponents.join(',\n  ')}
}

export default {
  install,
  version,
}
`

  const bundleTemplate = `\
${imports.join('\n')}\n
${exports.join('\n')}\n
${cssImports.join('\n')}\n
${version}
${install}
export {
  install,
  version,
  ${publicComponents.join(',\n  ')}
}

export default {
  install,
  version,
}
`

  const styleTemplate = `\
${cssImports.join('\n')}
`

  await Promise.all([
    writeFile(resolve(dir, 'index.js'), indexTemplate, 'utf-8'),
    writeFile(resolve(dir, BUNDLE_ENRTY_FILENAME), bundleTemplate, 'utf-8'),
    writeFile(resolve(dir, 'style.js'), styleTemplate, 'utf-8'),
  ])
}

export async function tsc(config: Record<string, any>) {
  const tsConfigPath = resolve(CWD, '_tsconfig.json')
  await writeFile(tsConfigPath, JSON.stringify(config, undefined, 2))
  const { stdout, stderr } = await execa('npx', ['tsc', '-p', tsConfigPath], {
    cwd: CWD,
  })
  stdout && logger.info(stdout)
  if (stderr) {
    throw new Error(stderr)
  }
  await unlink(tsConfigPath)
}
