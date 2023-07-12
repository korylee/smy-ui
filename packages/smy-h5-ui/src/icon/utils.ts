import { createLRUCache, kebabCase } from '../_utils/shared'
import { warn } from '../_utils/smy/warn'

const IconLRUCache = createLRUCache(25)

export const IconCache = {
  register(IconComponent: any) {
    if (!IconComponent || !IconComponent.name || !IconComponent.render) {
      warn('[IconCahce]', IconComponent + '不合法')
      return this
    }
    IconLRUCache.put(kebabCase(IconComponent.name), IconComponent)
    return this
  },
  unregister(name: string) {
    IconLRUCache.delete(name)
    return this
  },
  get(name: string) {
    return IconLRUCache.get(name)
  },
}
