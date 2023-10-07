import { isPlainObject } from '../_utils/is'
import { kebabCase } from '../_utils/shared'
import { warn } from '../_utils/smy/warn'

type SmyIconComponent = any

const IconCache: Record<string, SmyIconComponent> = Object.create(null)

export function register(name: string, icon: SmyIconComponent): void
export function register(icon: SmyIconComponent): void
export function register(...args: any[]) {
  const [name, icon] = (args.length === 1 ? [args[0]?.name, args[0]] : args) as [string, any]
  if (!name || !isPlainObject(icon) || !icon.render) {
    warn('IconCahce', name + '不合法')
    return
  }

  const normalizedName = kebabCase(name)
  IconCache[normalizedName] = icon
}

export function get(name: string) {
  if (!name) return undefined
  return IconCache[name]
}
