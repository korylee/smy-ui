import { isPlainObject, isString } from '../_utils/is'
import { kebabCase } from '../_utils/shared'
import { warn } from '../_utils/smy/warn'

type SmyIconComponent = any

const IconMap = new Map<string, any>()
const IconTimesMap = new Map<string, number>()

export function register(name: string, icon: SmyIconComponent): void
export function register(icon: SmyIconComponent): void
export function register(...args: any[]) {
  const [name, icon] = (args.length === 1 ? [args[0]?.name, args[0]] : args) as [string, any]
  if (!name || !isPlainObject(icon) || !icon.render) {
    warn('IconCahce', name + '不合法')
    return
  }

  const normalizedName = kebabCase(name)
  IconMap.set(normalizedName, icon)
  IconTimesMap.set(normalizedName, (IconTimesMap.get(name) ?? 0) + 1)
}

export function unregister(name: string): boolean
export function unregister(icon: SmyIconComponent): boolean
export function unregister(arg: any) {
  const name = isString(arg) ? arg : arg.name
  const normalizedName = kebabCase(name)
  const times = IconTimesMap.get(normalizedName)
  if (!times) return true
  if (times === 1) {
    IconMap.delete(normalizedName)
    IconTimesMap.delete(normalizedName)
    return true
  }
  IconTimesMap.set(normalizedName, times - 1)
  return false
}

export function registerIcons(...icons: SmyIconComponent[]) {
  icons.forEach((icon) => register(icon))
  return () => {
    icons.forEach((icon) => unregister(icon))
  }
}

export function getIcon(name: string) {
  if (!name) return undefined
  return IconMap.get(kebabCase(name))
}
