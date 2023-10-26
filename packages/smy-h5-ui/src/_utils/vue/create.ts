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
  function bem(el?: Mods, mods?: Mods) {
    if (el && !isString(el)) {
      mods = el
      el = ''
    }
    el = el ? `${name}__${el}` : name
    const generate = (mod: string) => ' ' + (mod[0] === '$' ? mod.replace('$', namespace) : `${el}--${mod}`)

    return `${el}${genBem(mods, generate)}`
  }
  return bem
}

export type BEM = ReturnType<typeof createBem>

export function createNamespace<C extends string, D extends string>(name: C, namespace: D): [`${D}-${C}`, BEM]
export function createNamespace<C extends string>(name: C): [`smy-${C}`, BEM]
export function createNamespace(name: string, namespace = 'smy') {
  const componentName = `${namespace}-${name}` as const
  return [componentName, createBem(namespace, componentName)] as const
}
