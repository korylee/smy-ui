import { NAMESPACE } from '../contant'
import { isArray, isPlainObject, isString } from '../is'

type Mod = string | Record<string, any>
type Mods = Mod | Mod[]

function genBem(mods: Mods | undefined, generate: (mod: string) => string): string {
  if (!mods) {
    return ''
  }
  if (isString(mods)) {
    return generate(mods)
  }
  if (isArray<Mod>(mods)) {
    return mods.reduce<string>((ret, item) => ret + genBem(item, generate), '')
  }
  if (isPlainObject(mods)) {
    return Object.keys(mods).reduce((ret, key) => ret + (mods[key] ? genBem(key, generate) : ''), '')
  }
  return ''
}

function createBem(namespace: string, name: string) {
  const prefixReg = new RegExp(`^${namespace}--`)
  function bem(el?: Mods, mods?: Mods) {
    if (el && !isString(el)) {
      mods = el
      el = ''
    }
    el = el ? `${name}__${el}` : name
    const generate = (mod: string) => {
      const affix = mod[0] === '$' ? mod.replace('$', namespace) : prefixReg.test(mod) ? mod : `${el}--${mod}`
      return ' ' + affix
    }

    return `${el}${genBem(mods, generate)}`
  }
  return bem
}

export type BEM = ReturnType<typeof createBem>

export function genCreateNamespace<N extends string>(namespace: N) {
  return function createNamespace(name: string) {
    const componentName = `${namespace}-${name}` as const
    return [componentName, createBem(namespace, componentName)] as const
  }
}

export const createNamespace = genCreateNamespace(NAMESPACE)
